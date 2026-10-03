-- Save a member and all committee/coordinator assignments in one transaction.
-- The function is only callable by the service-role client used by the CMS API.

CREATE OR REPLACE FUNCTION public.cms_save_member(
  p_member_id uuid,
  p_member jsonb,
  p_assignments jsonb DEFAULT '[]'::jsonb
)
RETURNS public.members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saved_member public.members;
  invalid_assignment_count integer;
BEGIN
  IF jsonb_typeof(COALESCE(p_assignments, '[]'::jsonb)) <> 'array' THEN
    RAISE EXCEPTION 'Assignments must be a JSON array';
  END IF;

  IF NULLIF(BTRIM(p_member->>'first_name'), '') IS NULL
    OR NULLIF(BTRIM(p_member->>'last_name'), '') IS NULL
    OR NULLIF(BTRIM(p_member->>'business_category'), '') IS NULL THEN
    RAISE EXCEPTION 'First name, last name and business category are required';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(p_assignments, '[]'::jsonb)) AS assignment
    WHERE COALESCE(assignment->>'committee_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  ) THEN
    RAISE EXCEPTION 'Every assignment must include a valid committee id';
  END IF;

  IF (
    SELECT COUNT(*)
    FROM jsonb_array_elements(COALESCE(p_assignments, '[]'::jsonb)) AS assignment
  ) <> (
    SELECT COUNT(DISTINCT assignment->>'committee_id')
    FROM jsonb_array_elements(COALESCE(p_assignments, '[]'::jsonb)) AS assignment
  ) THEN
    RAISE EXCEPTION 'A member cannot be assigned to the same committee more than once';
  END IF;

  SELECT COUNT(*)
  INTO invalid_assignment_count
  FROM jsonb_array_elements(COALESCE(p_assignments, '[]'::jsonb)) AS assignment
  LEFT JOIN public.committees committee
    ON committee.id = (assignment->>'committee_id')::uuid
  WHERE committee.id IS NULL;

  IF invalid_assignment_count > 0 THEN
    RAISE EXCEPTION 'One or more selected committees do not exist';
  END IF;

  IF p_member_id IS NULL THEN
    INSERT INTO public.members (
      first_name,
      last_name,
      business_category,
      company_name,
      phone,
      email,
      photo_url,
      chapter_role,
      power_team,
      is_power_team_captain,
      is_power_team_vice_captain,
      tagline,
      website,
      sort_order,
      is_active
    ) VALUES (
      BTRIM(p_member->>'first_name'),
      BTRIM(p_member->>'last_name'),
      BTRIM(p_member->>'business_category'),
      NULLIF(BTRIM(p_member->>'company_name'), ''),
      NULLIF(BTRIM(p_member->>'phone'), ''),
      NULLIF(BTRIM(p_member->>'email'), ''),
      NULLIF(BTRIM(p_member->>'photo_url'), ''),
      COALESCE(NULLIF(BTRIM(p_member->>'chapter_role'), ''), 'member'),
      NULLIF(BTRIM(p_member->>'power_team'), ''),
      COALESCE((p_member->>'is_power_team_captain')::boolean, false),
      COALESCE((p_member->>'is_power_team_vice_captain')::boolean, false),
      NULLIF(BTRIM(p_member->>'tagline'), ''),
      NULLIF(BTRIM(p_member->>'website'), ''),
      COALESCE((p_member->>'sort_order')::integer, 100),
      COALESCE((p_member->>'is_active')::boolean, true)
    )
    RETURNING * INTO saved_member;
  ELSE
    UPDATE public.members
    SET
      first_name = BTRIM(p_member->>'first_name'),
      last_name = BTRIM(p_member->>'last_name'),
      business_category = BTRIM(p_member->>'business_category'),
      company_name = NULLIF(BTRIM(p_member->>'company_name'), ''),
      phone = NULLIF(BTRIM(p_member->>'phone'), ''),
      email = NULLIF(BTRIM(p_member->>'email'), ''),
      photo_url = NULLIF(BTRIM(p_member->>'photo_url'), ''),
      chapter_role = COALESCE(NULLIF(BTRIM(p_member->>'chapter_role'), ''), 'member'),
      power_team = NULLIF(BTRIM(p_member->>'power_team'), ''),
      is_power_team_captain = COALESCE((p_member->>'is_power_team_captain')::boolean, false),
      is_power_team_vice_captain = COALESCE((p_member->>'is_power_team_vice_captain')::boolean, false),
      tagline = NULLIF(BTRIM(p_member->>'tagline'), ''),
      website = NULLIF(BTRIM(p_member->>'website'), ''),
      sort_order = COALESCE((p_member->>'sort_order')::integer, 100)
    WHERE id = p_member_id
    RETURNING * INTO saved_member;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Member not found';
    END IF;
  END IF;

  DELETE FROM public.committee_members
  WHERE member_id = saved_member.id;

  INSERT INTO public.committee_members (committee_id, member_id, role)
  SELECT
    committee.id,
    saved_member.id,
    COALESCE(
      NULLIF(BTRIM(assignment->>'role'), ''),
      CASE committee.committee_group
        WHEN 'visitor_host' THEN 'Visitor Host'
        WHEN 'coordinator' THEN 'coordinator'
        ELSE 'member'
      END
    )
  FROM jsonb_array_elements(COALESCE(p_assignments, '[]'::jsonb)) AS assignment
  JOIN public.committees committee
    ON committee.id = (assignment->>'committee_id')::uuid;

  RETURN saved_member;
END;
$$;

REVOKE ALL ON FUNCTION public.cms_save_member(uuid, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_save_member(uuid, jsonb, jsonb) TO service_role;
