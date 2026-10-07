export const MAX_LOGIN_ATTEMPTS = 3
export const LOGIN_LOCK_MINUTES = 30

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const normalized = value.trim().toLowerCase()
  return normalized && normalized.length <= 254 ? normalized : null
}

export function isAuthorizedAdmin(userEmail: unknown, configuredAdminEmail: string): boolean {
  const user = normalizeEmail(userEmail)
  const admin = normalizeEmail(configuredAdminEmail)
  return user !== null && admin !== null && user === admin
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function loginAttemptIdentifier(
  adminEmail: string,
  clientAddress: string,
): Promise<string> {
  const normalized = normalizeEmail(adminEmail)
  if (!normalized) throw new Error("CMS_ADMIN_EMAIL is invalid")
  return sha256Hex(`${normalized}|${clientAddress.trim().toLowerCase() || "unavailable"}`)
}

export function createCmsSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export async function cmsSessionTokenHash(token: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null
  return sha256Hex(token)
}

export function getClientAddress(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return headers.get("cf-connecting-ip")?.trim()
    || headers.get("x-real-ip")?.trim()
    || forwarded
    || "unavailable"
}

export function buildLockoutEmail(input: {
  clientAddress: string
  lockedUntil: string
  userAgent: string
}): { subject: string; text: string } {
  return {
    subject: "BNI United CMS login locked after 3 failed attempts",
    text: [
      "The BNI United CMS was locked after three failed sign-in attempts.",
      `Locked until: ${input.lockedUntil}`,
      `Client address: ${input.clientAddress}`,
      `User agent: ${input.userAgent || "unavailable"}`,
      "If this was not you, review access logs before unlocking or changing the administrator account.",
    ].join("\n"),
  }
}
