import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"
import {
  buildLockoutEmail,
  cmsSessionTokenHash,
  createCmsSessionToken,
  getClientAddress,
  isAuthorizedAdmin,
  LOGIN_LOCK_MINUTES,
  loginAttemptIdentifier,
  MAX_LOGIN_ATTEMPTS,
  normalizeEmail,
} from "./auth.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-CMS-Token",
}

class ConfigurationError extends Error {}

interface CmsConfig {
  adminEmail: string
  anonKey: string
  serviceRoleKey: string
  supabaseUrl: string
}

interface AlertConfig {
  resendApiKey: string
  resendFromEmail: string
}

interface LoginAttemptResult {
  failure_count: number
  is_locked: boolean
  retry_after_seconds: number
  should_alert: boolean
}

interface LoginStatusResult {
  is_locked: boolean
  retry_after_seconds: number
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim()
  if (!value) throw new ConfigurationError(`${name} is not configured`)
  return value
}

function getConfig(): CmsConfig {
  return {
    adminEmail: Deno.env.get("CMS_ADMIN_EMAIL")?.trim() ?? "",
    anonKey: requiredEnv("SUPABASE_ANON_KEY"),
    serviceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    supabaseUrl: requiredEnv("SUPABASE_URL"),
  }
}

function getAlertConfig(): AlertConfig | null {
  const resendApiKey = Deno.env.get("RESEND_API_KEY")?.trim()
  const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL")?.trim()
  return resendApiKey && resendFromEmail ? { resendApiKey, resendFromEmail } : null
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
  })
}

function lockedResponse(retryAfterSeconds: number, notificationSent = true): Response {
  const retryAfter = Math.max(1, Math.ceil(retryAfterSeconds))
  const notification = notificationSent
    ? "The administrator has been notified."
    : "The alert could not be delivered; contact the administrator."
  return json(
    {
      error: `Too many failed attempts. Try again in ${LOGIN_LOCK_MINUTES} minutes. ${notification}`,
      retryAfterSeconds: retryAfter,
    },
    429,
    { "Retry-After": String(retryAfter) },
  )
}

async function sendLockoutAlert(
  config: CmsConfig,
  alertConfig: AlertConfig,
  req: Request,
  lockedUntil: string,
): Promise<void> {
  const message = buildLockoutEmail({
    clientAddress: getClientAddress(req.headers),
    lockedUntil,
    userAgent: req.headers.get("user-agent") ?? "unavailable",
  })
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${alertConfig.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: alertConfig.resendFromEmail,
      to: [config.adminEmail],
      subject: message.subject,
      text: message.text,
    }),
  })

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500)
    throw new Error(`Login alert delivery failed (${response.status}): ${detail}`)
  }
}

const STATISTIC_REGIONS = ["worldwide", "india", "mumbai", "united"] as const
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const CMS_SESSION_HOURS = 8

type StatisticRegion = (typeof STATISTIC_REGIONS)[number]

interface StatisticItem {
  label: string
  value: number
  suffix: string
}

interface StatisticRecord {
  region: StatisticRegion
  summary: string
  stats: StatisticItem[]
}

function validateStatistics(input: unknown): StatisticRecord[] | null {
  if (!Array.isArray(input) || input.length !== STATISTIC_REGIONS.length) return null

  const records: StatisticRecord[] = []
  for (const item of input) {
    if (!item || typeof item !== "object") return null
    const candidate = item as Record<string, unknown>
    if (
      typeof candidate.region !== "string"
      || !STATISTIC_REGIONS.includes(candidate.region as StatisticRegion)
      || typeof candidate.summary !== "string"
      || !candidate.summary.trim()
      || candidate.summary.length > 500
      || !Array.isArray(candidate.stats)
      || candidate.stats.length !== 4
    ) return null

    const stats: StatisticItem[] = []
    for (const stat of candidate.stats) {
      if (!stat || typeof stat !== "object") return null
      const value = stat as Record<string, unknown>
      if (
        typeof value.label !== "string"
        || !value.label.trim()
        || value.label.length > 80
        || typeof value.value !== "number"
        || !Number.isSafeInteger(value.value)
        || value.value < 0
        || typeof value.suffix !== "string"
        || value.suffix.length > 20
      ) return null
      stats.push({ label: value.label.trim(), value: value.value, suffix: value.suffix.trim() })
    }

    records.push({
      region: candidate.region as StatisticRegion,
      summary: candidate.summary.trim(),
      stats,
    })
  }

  if (new Set(records.map((record) => record.region)).size !== STATISTIC_REGIONS.length) return null
  return records
}

function memberPhotoNames(memberId: string): string[] {
  return ["jpg", "png", "webp"].map((extension) => `${memberId}.${extension}`)
}

async function cleanupInactivePhotos(supabase: ReturnType<typeof createClient>): Promise<void> {
  const { data: inactiveMembers, error: membersError } = await supabase
    .from("members")
    .select("id")
    .eq("is_active", false)
    .not("photo_url", "is", null)
  if (membersError) throw membersError
  if (!inactiveMembers?.length) return

  const memberIds = inactiveMembers.map((member) => member.id as string)
  const { error: storageError } = await supabase.storage
    .from("member-photos")
    .remove(memberIds.flatMap(memberPhotoNames))
  if (storageError) throw storageError

  const { error: updateError } = await supabase
    .from("members")
    .update({ photo_url: null })
    .in("id", memberIds)
  if (updateError) throw updateError
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { action } = body
    const config = getConfig()
    const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const authClient = createClient(config.supabaseUrl, config.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    if (action === "get-public-directory") {
      await cleanupInactivePhotos(supabase)
      const [membersResult, committeesResult, assignmentsResult] = await Promise.all([
        supabase.from("members").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("committees").select("*").order("sort_order"),
        supabase.from("committee_members").select("*"),
      ])
      if (membersResult.error) throw membersResult.error
      if (committeesResult.error) throw committeesResult.error
      if (assignmentsResult.error) throw assignmentsResult.error

      const members = membersResult.data ?? []
      const activeMemberIds = new Set(members.map((member) => member.id))
      const committeeMembers = (assignmentsResult.data ?? [])
        .filter((assignment) => activeMemberIds.has(assignment.member_id))
      return json({
        members,
        committees: committeesResult.data ?? [],
        committeeMembers,
      })
    }

    if (action === "login") {
      const { username, password } = body
      const adminEmail = normalizeEmail(config.adminEmail)
      const attemptedEmail = normalizeEmail(username)
      const clientAddress = getClientAddress(req.headers)
      const attemptIdentifier = await loginAttemptIdentifier(config.adminEmail, clientAddress)

      if (!adminEmail) throw new ConfigurationError("CMS_ADMIN_EMAIL is invalid")

      const { data: loginStatus, error: loginStatusError } = await supabase
        .rpc("cms_login_attempt_status", { p_identifier: attemptIdentifier })
        .single<LoginStatusResult>()
      if (loginStatusError) throw loginStatusError
      if (loginStatus.is_locked) {
        return lockedResponse(loginStatus.retry_after_seconds)
      }

      let authenticatedUserId: string | null = null
      if (attemptedEmail && typeof password === "string" && password.length <= 1024) {
        const { data, error } = await authClient.auth.signInWithPassword({
          email: attemptedEmail,
          password,
        })
        if (!error && data.session && isAuthorizedAdmin(data.user?.email, adminEmail)) {
          authenticatedUserId = data.user.id
        }
      }

      if (authenticatedUserId) {
        const { error: resetError } = await supabase
          .rpc("cms_reset_login_attempts", { p_identifier: attemptIdentifier })
        if (resetError) throw resetError

        const token = createCmsSessionToken()
        const tokenHash = await cmsSessionTokenHash(token)
        if (!tokenHash) throw new Error("Failed to create CMS session")
        const expiresAt = new Date(Date.now() + CMS_SESSION_HOURS * 60 * 60 * 1000).toISOString()
        const { error: cleanupError } = await supabase
          .from("cms_sessions")
          .delete()
          .lt("expires_at", new Date().toISOString())
        if (cleanupError) throw cleanupError
        const { error: sessionError } = await supabase
          .from("cms_sessions")
          .insert({ token_hash: tokenHash, user_id: authenticatedUserId, expires_at: expiresAt })
        if (sessionError) throw sessionError
        return json({ token })
      }

      const { data: failure, error: failureError } = await supabase
        .rpc("cms_record_login_failure", { p_identifier: attemptIdentifier })
        .single<LoginAttemptResult>()
      if (failureError) throw failureError

      if (failure.should_alert) {
        const lockedUntil = new Date(Date.now() + failure.retry_after_seconds * 1000).toISOString()
        const alertConfig = getAlertConfig()
        let notificationSent = false
        if (alertConfig) {
          try {
            await sendLockoutAlert(config, alertConfig, req, lockedUntil)
            notificationSent = true
          } catch (alertError) {
            console.error(alertError)
            await supabase
              .from("cms_login_attempts")
              .update({ alert_attempted_at: null })
              .eq("identifier", attemptIdentifier)
          }
        }
        return lockedResponse(failure.retry_after_seconds, notificationSent)
      }

      if (failure.is_locked) {
        return lockedResponse(failure.retry_after_seconds)
      }

      return json({
        error: "Invalid credentials",
        remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - failure.failure_count),
      }, 401)
    }

    const token = req.headers.get("X-CMS-Token") ?? ""
    const tokenHash = await cmsSessionTokenHash(token)
    if (!tokenHash) {
      return json({ error: "Unauthorized" }, 401)
    }
    const { data: cmsSession, error: sessionError } = await supabase
      .from("cms_sessions")
      .select("expires_at")
      .eq("token_hash", tokenHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle()
    if (sessionError) throw sessionError
    if (!cmsSession) return json({ error: "Unauthorized" }, 401)

    switch (action) {
      case "get-members": {
        await cleanupInactivePhotos(supabase)
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("sort_order")
        if (error) throw error
        return json({ data })
      }

      case "get-committee-data": {
        const [committeesResult, membersResult] = await Promise.all([
          supabase.from("committees").select("*").order("sort_order"),
          supabase.from("committee_members").select("*"),
        ])
        if (committeesResult.error) throw committeesResult.error
        if (membersResult.error) throw membersResult.error
        return json({
          committees: committeesResult.data ?? [],
          committeeMembers: membersResult.data ?? [],
        })
      }

      case "get-statistics": {
        const { data, error } = await supabase
          .from("chapter_statistics")
          .select("region, summary, stats, updated_at")
        if (error) throw error
        return json({ data })
      }

      case "save-statistics": {
        const statistics = validateStatistics(body.statistics)
        if (!statistics) {
          return json({ error: "All four statistic groups and their four valid statistics are required" }, 400)
        }

        const updatedAt = new Date().toISOString()
        const { data, error } = await supabase
          .from("chapter_statistics")
          .upsert(
            statistics.map((record) => ({ ...record, updated_at: updatedAt })),
            { onConflict: "region" },
          )
          .select("region, summary, stats, updated_at")
        if (error) throw error
        return json({ data })
      }

      case "save-member": {
        const { id, member, assignments = [] } = body
        if (!member || !Array.isArray(assignments)) {
          return json({ error: "Member details and assignments are required" }, 400)
        }

        const { data, error } = await supabase
          .rpc("cms_save_member", {
            p_member_id: id ?? null,
            p_member: member,
            p_assignments: assignments,
          })
          .single()
        if (error) throw error

        const { data: savedAssignments, error: assignmentsError } = await supabase
          .from("committee_members")
          .select("*")
          .eq("member_id", data.id)
        if (assignmentsError) throw assignmentsError

        return json({ data, assignments: savedAssignments ?? [] })
      }

      case "soft-delete-member": {
        const { id } = body
        if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
          return json({ error: "A valid member id is required" }, 400)
        }

        const { error } = await supabase
          .from("members")
          .update({ is_active: false })
          .eq("id", id)
        if (error) throw error

        const photoNames = memberPhotoNames(id)
        const { error: storageError } = await supabase.storage
          .from("member-photos")
          .remove(photoNames)
        if (storageError) throw storageError

        const { error: clearPhotoError } = await supabase
          .from("members")
          .update({ photo_url: null })
          .eq("id", id)
        if (clearPhotoError) throw clearPhotoError
        return json({ success: true })
      }

      case "restore-member": {
        const { id } = body
        if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
          return json({ error: "A valid member id is required" }, 400)
        }
        const { error } = await supabase
          .from("members")
          .update({ is_active: true })
          .eq("id", id)
        if (error) throw error
        return json({ success: true })
      }

      case "upload-photo": {
        const { fileBase64, contentType, memberId } = body
        if (
          typeof memberId !== "string"
          || !UUID_PATTERN.test(memberId)
          || typeof fileBase64 !== "string"
          || typeof contentType !== "string"
          || !["image/jpeg", "image/png", "image/webp"].includes(contentType)
        ) {
          return json({ error: "A valid active member and JPEG, PNG, or WebP image are required" }, 400)
        }

        const { data: member, error: memberError } = await supabase
          .from("members")
          .select("is_active")
          .eq("id", memberId)
          .single()
        if (memberError) throw memberError
        if (!member.is_active) {
          return json({ error: "Restore this member before uploading a public photo" }, 409)
        }

        const byteChars = atob(fileBase64 as string)
        const bytes = new Uint8Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) {
          bytes[i] = byteChars.charCodeAt(i)
        }
        const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg"
        const fileName = `${memberId}.${ext}`
        const { error } = await supabase.storage
          .from("member-photos")
          .upload(fileName, bytes, { contentType, upsert: true })
        if (error) throw error
        const obsoleteNames = ["jpg", "png", "webp"]
          .filter((candidate) => candidate !== ext)
          .map((candidate) => `${memberId}.${candidate}`)
        const { error: cleanupError } = await supabase.storage
          .from("member-photos")
          .remove(obsoleteNames)
        if (cleanupError) throw cleanupError
        const { data: urlData } = supabase.storage
          .from("member-photos")
          .getPublicUrl(fileName)
        const { data: updatedMember, error: photoUrlError } = await supabase
          .from("members")
          .update({ photo_url: urlData.publicUrl })
          .eq("id", memberId)
          .eq("is_active", true)
          .select("id")
          .maybeSingle()
        if (photoUrlError) throw photoUrlError
        if (!updatedMember) {
          await supabase.storage.from("member-photos").remove([fileName])
          return json({ error: "This member was deactivated while the photo was uploading" }, 409)
        }
        return json({ url: urlData.publicUrl })
      }

      default:
        return json({ error: "Unknown action" }, 400)
    }
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof ConfigurationError) {
      return json({ error: "CMS authentication is not configured" }, 503)
    }
    return json({ error: "Internal server error" }, 500)
  }
})
