import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-CMS-Token",
}

const CMS_USERNAME = "BNI-United@CMS-Admin"
const CMS_PASSWORD = "BniUnited@26-27"
const SESSION_SECRET = "bni-cms-session-secret-2026-united"
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
}

async function createSessionToken(): Promise<string> {
  const timestamp = Date.now()
  const payload = `cms:${timestamp}`
  const key = await getHmacKey()
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `${payload}.${sigHex}`
}

async function verifySessionToken(token: string): Promise<boolean> {
  const dotIdx = token.lastIndexOf(".")
  if (dotIdx === -1) return false

  const payload = token.substring(0, dotIdx)
  const sigHex = token.substring(dotIdx + 1)

  const match = payload.match(/^cms:(\d+)$/)
  if (!match) return false

  const timestamp = parseInt(match[1])
  if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_EXPIRY_MS) return false

  const key = await getHmacKey()
  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return sigHex === expectedHex
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { action } = body

    if (action === "login") {
      const { username, password } = body
      if (username === CMS_USERNAME && password === CMS_PASSWORD) {
        const token = await createSessionToken()
        return json({ token })
      }
      return json({ error: "Invalid credentials" }, 401)
    }

    const token = req.headers.get("X-CMS-Token") ?? ""
    if (!(await verifySessionToken(token))) {
      return json({ error: "Unauthorized" }, 401)
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    switch (action) {
      case "get-members": {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .order("sort_order")
        if (error) throw error
        return json({ data })
      }

      case "add-member": {
        const { member } = body
        const { data, error } = await supabase
          .from("members")
          .insert(member)
          .select()
          .single()
        if (error) throw error
        return json({ data })
      }

      case "update-member": {
        const { id, member } = body
        const { data, error } = await supabase
          .from("members")
          .update(member)
          .eq("id", id)
          .select()
          .single()
        if (error) throw error
        return json({ data })
      }

      case "soft-delete-member": {
        const { id } = body
        const { error } = await supabase
          .from("members")
          .update({ is_active: false })
          .eq("id", id)
        if (error) throw error
        return json({ success: true })
      }

      case "restore-member": {
        const { id } = body
        const { error } = await supabase
          .from("members")
          .update({ is_active: true })
          .eq("id", id)
        if (error) throw error
        return json({ success: true })
      }

      case "upload-photo": {
        const { fileBase64, contentType, memberId } = body
        const byteChars = atob(fileBase64 as string)
        const bytes = new Uint8Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) {
          bytes[i] = byteChars.charCodeAt(i)
        }
        const ext = (contentType as string).includes("png") ? "png" : "jpg"
        const fileName = `${memberId}.${ext}`
        const { error } = await supabase.storage
          .from("member-photos")
          .upload(fileName, bytes, { contentType, upsert: true })
        if (error) throw error
        const { data: urlData } = supabase.storage
          .from("member-photos")
          .getPublicUrl(fileName)
        return json({ url: urlData.publicUrl })
      }

      default:
        return json({ error: "Unknown action" }, 400)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return json({ error: message }, 500)
  }
})
