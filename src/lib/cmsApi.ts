import type { Member } from "./types"

const TOKEN_KEY = "bni-cms-token"
const EDGE_URL = import.meta.env.DEV
  ? "/api-proxy"
  : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cms-api`

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
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
    throw new Error(data.error ?? `Request failed (${res.status})`)
  }
  return data as T
}

export async function login(username: string, password: string): Promise<void> {
  const data = await call<{ token: string }>("login", { username, password }, false)
  setToken(data.token)
}

export async function getMembers(): Promise<Member[]> {
  const data = await call<{ data: Member[] }>("get-members")
  return data.data
}

export async function addMember(member: Partial<Member>): Promise<Member> {
  const data = await call<{ data: Member }>("add-member", { member })
  return data.data
}

export async function updateMember(id: string, member: Partial<Member>): Promise<Member> {
  const data = await call<{ data: Member }>("update-member", { id, member })
  return data.data
}

export async function softDeleteMember(id: string): Promise<void> {
  await call("soft-delete-member", { id })
}

export async function restoreMember(id: string): Promise<void> {
  await call("restore-member", { id })
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
