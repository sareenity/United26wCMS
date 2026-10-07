import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
  buildLockoutEmail,
  cmsSessionTokenHash,
  createCmsSessionToken,
  isAuthorizedAdmin,
  loginAttemptIdentifier,
  MAX_LOGIN_ATTEMPTS,
} from "./auth.ts"

test("only the configured administrator email is authorized", () => {
  assert.equal(isAuthorizedAdmin(" Admin@Example.com ", "admin@example.com"), true)
  assert.equal(isAuthorizedAdmin("other@example.com", "admin@example.com"), false)
  assert.equal(isAuthorizedAdmin(undefined, "admin@example.com"), false)
})

test("the database attempt key is stable and does not expose the email", async () => {
  const first = await loginAttemptIdentifier("Admin@Example.com", "203.0.113.10")
  const second = await loginAttemptIdentifier(" admin@example.com ", "203.0.113.10")
  const otherClient = await loginAttemptIdentifier("admin@example.com", "203.0.113.11")

  assert.equal(first, second)
  assert.notEqual(first, otherClient)
  assert.match(first, /^[a-f0-9]{64}$/)
  assert.equal(first.includes("admin"), false)
})

test("CMS sessions use opaque random tokens rather than Supabase access tokens", async () => {
  const first = createCmsSessionToken()
  const second = createCmsSessionToken()

  assert.match(first, /^[A-Za-z0-9_-]{43}$/)
  assert.notEqual(first, second)
  assert.match((await cmsSessionTokenHash(first)) ?? "", /^[a-f0-9]{64}$/)
  assert.equal(await cmsSessionTokenHash("not-a-cms-session"), null)
  assert.equal(await cmsSessionTokenHash("header.payload.signature"), null)
})

test("lockout policy and email contain no credential material", () => {
  assert.equal(MAX_LOGIN_ATTEMPTS, 3)
  const email = buildLockoutEmail({
    clientAddress: "203.0.113.10",
    lockedUntil: "2026-10-05T05:00:00.000Z",
    userAgent: "Security test",
  })

  assert.match(email.subject, /3 failed attempts/)
  assert.match(email.text, /203\.0\.113\.10/)
  assert.doesNotMatch(email.text.toLowerCase(), /password/)
})

test("database throttling matches the Edge Function policy", async () => {
  const migrationUrl = new URL("../../migrations/20261005001000_secure_cms_access.sql", import.meta.url)
  const migration = await readFile(migrationUrl, "utf8")

  assert.match(migration, new RegExp(`v_count >= ${MAX_LOGIN_ATTEMPTS}`))
  assert.match(migration, /interval '30 minutes'/)
  assert.match(migration, /pg_advisory_xact_lock/)
  assert.match(migration, /REVOKE ALL ON TABLE public\.cms_login_attempts FROM PUBLIC, anon, authenticated/)
  assert.match(migration, /REVOKE ALL ON TABLE public\.cms_sessions FROM PUBLIC, anon, authenticated/)
  assert.match(migration, /members\.is_active = true/)
})
