/*
# Drop Overly-Permissive Authenticated Write Policies

Removes all authenticated-role write policies from members, committees,
and committee_members that used unconditional USING (true) / WITH CHECK (true).

All CMS mutations go through the cms-api edge function which uses the service
role key — it bypasses RLS entirely. No authenticated-role write policies are
needed. Dropping them removes the risk of any authenticated Supabase session
performing unrestricted direct writes.
*/

DROP POLICY IF EXISTS "cms_insert_members" ON members;
DROP POLICY IF EXISTS "cms_update_members" ON members;
DROP POLICY IF EXISTS "cms_read_members" ON members;

DROP POLICY IF EXISTS "cms_insert_committees" ON committees;
DROP POLICY IF EXISTS "cms_update_committees" ON committees;

DROP POLICY IF EXISTS "cms_insert_committee_members" ON committee_members;
DROP POLICY IF EXISTS "cms_update_committee_members" ON committee_members;
DROP POLICY IF EXISTS "cms_delete_committee_members" ON committee_members;
