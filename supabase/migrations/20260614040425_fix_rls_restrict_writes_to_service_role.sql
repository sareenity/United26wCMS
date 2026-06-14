
-- Drop the overly-permissive "always true" write policies for authenticated users.
-- These tables contain shared chapter data with no per-user ownership column,
-- so authenticated client writes should not be allowed at all.
-- Mutations must go through the service role (server-side / admin tooling only).

-- members
DROP POLICY IF EXISTS "auth_insert_members" ON members;
DROP POLICY IF EXISTS "auth_update_members" ON members;
DROP POLICY IF EXISTS "auth_delete_members" ON members;

-- committees
DROP POLICY IF EXISTS "auth_insert_committees" ON committees;
DROP POLICY IF EXISTS "auth_update_committees" ON committees;
DROP POLICY IF EXISTS "auth_delete_committees" ON committees;

-- committee_members
DROP POLICY IF EXISTS "auth_insert_committee_members" ON committee_members;
DROP POLICY IF EXISTS "auth_update_committee_members" ON committee_members;
DROP POLICY IF EXISTS "auth_delete_committee_members" ON committee_members;
