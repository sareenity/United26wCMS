
/*
# CMS Admin: Soft Delete + Storage Setup

## Summary
Adds soft-delete support to the members table and configures RLS so that
the public-facing directory only shows active members while the CMS admin
can see all records (active and inactive).

## Changes

### Modified Tables
- `members`
  - Added `is_active boolean NOT NULL DEFAULT true`
    Active flag. When set to false the member is soft-deleted and
    hidden from the public directory. All existing rows default to true.

### RLS Policy Changes
- `public_read_members` (members SELECT for anon): now filters `is_active = true`
  so inactive members are invisible to the main site without any code changes.
- Added `cms_read_members` (members SELECT for authenticated): allows the
  authenticated CMS session to see ALL members including inactive ones,
  enabling the admin to restore past members.
- Added write policies for authenticated role (INSERT / UPDATE) so the CMS
  admin (authenticated via the edge function session) can mutate data.
  Hard-delete is intentionally omitted — only soft-delete via UPDATE is permitted.
- committees and committee_members write policies restored for authenticated
  so the edge function's Supabase client (with service_role bypass) works.

## Notes
1. Soft delete: set is_active = false rather than deleting rows.
2. The public directory automatically hides inactive members via the anon RLS policy.
3. The CMS admin reads all members (including inactive) via the authenticated policy.
*/

-- Add is_active column (idempotent via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE members ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- Update public read policy to only show active members
DROP POLICY IF EXISTS "public_read_members" ON members;
CREATE POLICY "public_read_members" ON members
  FOR SELECT TO anon
  USING (is_active = true);

-- CMS admin (authenticated) can read ALL members including inactive
DROP POLICY IF EXISTS "cms_read_members" ON members;
CREATE POLICY "cms_read_members" ON members
  FOR SELECT TO authenticated
  USING (true);

-- CMS admin can insert new members
DROP POLICY IF EXISTS "cms_insert_members" ON members;
CREATE POLICY "cms_insert_members" ON members
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- CMS admin can update members (includes soft-delete via is_active = false)
DROP POLICY IF EXISTS "cms_update_members" ON members;
CREATE POLICY "cms_update_members" ON members
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Committees: restore write access for authenticated
DROP POLICY IF EXISTS "cms_insert_committees" ON committees;
CREATE POLICY "cms_insert_committees" ON committees
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "cms_update_committees" ON committees;
CREATE POLICY "cms_update_committees" ON committees
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Committee members: restore write access for authenticated
DROP POLICY IF EXISTS "cms_insert_committee_members" ON committee_members;
CREATE POLICY "cms_insert_committee_members" ON committee_members
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "cms_update_committee_members" ON committee_members;
CREATE POLICY "cms_update_committee_members" ON committee_members
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_delete_committee_members" ON committee_members;
CREATE POLICY "cms_delete_committee_members" ON committee_members
  FOR DELETE TO authenticated USING (true);
