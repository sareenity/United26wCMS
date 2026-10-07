# CMS security setup

The CMS now uses Supabase Auth. No administrator password or session-signing key is stored in this repository.

## 1. Apply the database migration

Apply `supabase/migrations/20261005001000_secure_cms_access.sql` to the production Supabase project. It creates service-role-only login-attempt and opaque CMS-session tables, and restricts anonymous committee assignments to active members.

## 2. Create the administrator

In Supabase Dashboard → Authentication → Users, create the administrator user with:

- Email: `rohitdksareen@gmail.com`
- Password: choose a new strong password that has never appeared in source control

Do not add that password to `.env`, GitHub, Vercel, or this repository.

## 3. Configure Edge Function secrets

Set these secrets for the `cms-api` Edge Function:

```text
CMS_ADMIN_EMAIL=rohitdksareen@gmail.com
RESEND_API_KEY=<Resend API key>
RESEND_FROM_EMAIL=BNI United CMS <alerts@your-verified-domain.example>
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically by Supabase Edge Functions.

The Resend sender must use a verified domain. The function fails closed when any required authentication or email setting is missing.

## 4. Configure the web deployment

Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and server-side `SUPABASE_URL` in Vercel. Local development reads the first two values from the ignored `.env` file.

## 5. Deploy and verify

Deploy the migration, Edge Function, and web app together. Verify that:

1. A valid Supabase Auth administrator can sign in.
2. Two failed attempts from one client address return `401`; the third returns `429`, starts a 30-minute client lock, and sends one alert email.
3. A correct password is rejected from that client while locked and works after the lock expires; another client cannot clear or reuse its counter.
4. A Supabase Auth access token obtained outside the CMS login endpoint is rejected by privileged CMS actions.
5. Anonymous directory requests contain only active members and active-member assignments.
6. The CMS can still list and restore inactive contacts.
7. Previously public inactive-member photo URLs return `404` after the first secured directory or CMS members request performs cleanup.

The previously committed custom password and signing key must be considered compromised even after removal because Git history retains them. The new Supabase Auth password must be different.
