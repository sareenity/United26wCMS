-- Inactive member contact data is admin-only. The CMS reads it through the
-- service-role Edge Function after its opaque CMS session has been validated.
-- No browser-authenticated Supabase session should be able to bypass that gate.

DROP POLICY IF EXISTS "cms_read_members" ON public.members;
DROP POLICY IF EXISTS "authenticated_read_members" ON public.members;
DROP POLICY IF EXISTS "cms_read_committee_members" ON public.committee_members;
DROP POLICY IF EXISTS "authenticated_read_committee_members" ON public.committee_members;

REVOKE ALL ON TABLE public.members FROM authenticated;
REVOKE ALL ON TABLE public.committee_members FROM authenticated;

-- Keep the public directory limited to active members and active assignments.
DROP POLICY IF EXISTS "public_read_members" ON public.members;
CREATE POLICY "public_read_members"
  ON public.members
  FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "public_read_active_committee_members" ON public.committee_members;
DROP POLICY IF EXISTS "public_read_committee_members" ON public.committee_members;
CREATE POLICY "public_read_active_committee_members"
  ON public.committee_members
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.members
      WHERE members.id = committee_members.member_id
        AND members.is_active = true
    )
  );
