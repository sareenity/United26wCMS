import { supabaseAnonKey, supabaseUrl } from "./supabase"
import type {
  CommitteeAssignmentInput,
  CommitteeData,
  CommitteeMember,
  Member,
} from "./types"
import {
  normalizeChapterStatistics,
  STATISTIC_REGIONS,
  type ChapterStatisticsByRegion,
} from "./statistics"

const TOKEN_KEY = "bni-cms-token"
const EDGE_URL = `${supabaseUrl}/functions/v1/cms-api`

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function logout(): void {
  clearToken()
}

async function call<T>(
  action: string,
  body: Record<string, unknown> = {},
  requiresAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${supabaseAnonKey}`,
    apikey: supabaseAnonKey,
  }
  if (requiresAuth) {
    const token = getToken()
    if (!token) throw new Error("Not authenticated")
    headers["X-CMS-Token"] = token
  }
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    if (requiresAuth && res.status === 401) clearToken()
    throw new CmsApiError(
      data.error ?? `Request failed (${res.status})`,
      res.status,
      typeof data.retryAfterSeconds === "number" ? data.retryAfterSeconds : null,
    )
  }
  return data as T
}

export class CmsApiError extends Error {
  readonly status: number
  readonly retryAfterSeconds: number | null

  constructor(
    message: string,
    status: number,
    retryAfterSeconds: number | null,
  ) {
    super(message)
    this.name = "CmsApiError"
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export async function login(username: string, password: string): Promise<void> {
  const data = await call<{ token: string }>("login", { username, password }, false)
  setToken(data.token)
}

export async function getMembers(): Promise<Member[]> {
  const data = await call<{ data: Member[] }>("get-members")
  return data.data
}

export async function getCommitteeData(): Promise<CommitteeData> {
  return call<CommitteeData>("get-committee-data")
}

export async function saveMember(
  member: Partial<Member>,
  assignments: CommitteeAssignmentInput[],
  id?: string,
): Promise<{ member: Member; assignments: CommitteeMember[] }> {
  const data = await call<{ data: Member; assignments: CommitteeMember[] }>("save-member", {
    id: id ?? null,
    member,
    assignments,
  })
  return { member: data.data, assignments: data.assignments }
}

export async function softDeleteMember(id: string): Promise<void> {
  await call("soft-delete-member", { id })
}

export async function restoreMember(id: string): Promise<void> {
  await call("restore-member", { id })
}

export async function getChapterStatistics(): Promise<ChapterStatisticsByRegion> {
  const data = await call<{ data: unknown }>("get-statistics")
  return normalizeChapterStatistics(data.data)
}

export async function saveChapterStatistics(
  statistics: ChapterStatisticsByRegion,
): Promise<ChapterStatisticsByRegion> {
  const regions = STATISTIC_REGIONS.map((region) => statistics[region])
  const data = await call<{ data: unknown }>("save-statistics", { statistics: regions })
  return normalizeChapterStatistics(data.data)
}

export async function uploadPhoto(memberId: string, blob: Blob): Promise<string> {
  const fileBase64 = await blobToBase64(blob)
  const data = await call<{ url: string }>("upload-photo", {
    memberId,
    fileBase64,
    contentType: blob.type || "image/jpeg",
  })
  return data.url
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
