/*
# Five Power Teams — October 2026 to March 2027

Synchronizes the five-team roster supplied for the current term. The CMS
remains the canonical editing surface after this baseline is applied.
*/

BEGIN;

UPDATE public.members
SET
  power_team = NULL,
  is_power_team_captain = false,
  is_power_team_vice_captain = false
WHERE is_active = true
  AND chapter_role <> 'support';

WITH assignments (member_name, power_team, is_captain, is_vice_captain) AS (
  VALUES
    ('Hardik Bhanushali', 'Corporate', true, false),
    ('Purva Velapure-Gokhale', 'Corporate', false, true),
    ('Ankit Surolia', 'Corporate', false, false),
    ('Janish Jain', 'Corporate', false, false),
    ('Divya Singh', 'Corporate', false, false),
    ('Tamanna Mulchandani', 'Corporate', false, false),

    ('Adnan Vahanvaty', 'Marketing & Branding', true, false),
    ('Zubin Kutar', 'Marketing & Branding', false, true),
    ('Sahil Amesur', 'Marketing & Branding', false, false),
    ('Sachin Pawar', 'Marketing & Branding', false, false),
    ('Rushi Thar', 'Marketing & Branding', false, false),
    ('Abhishek Jaiswal', 'Marketing & Branding', false, false),
    ('Rohit DK Sareen', 'Marketing & Branding', false, false),

    ('Sanikka Vankadia', 'MSME', true, false),
    ('Rohit Jhunjhunwala', 'MSME', false, true),
    ('Priyanka Gidwani', 'MSME', false, false),
    ('Anuja Shah', 'MSME', false, false),
    ('Shweta Chheda', 'MSME', false, false),
    ('Nikhil Gala', 'MSME', false, false),

    ('Nalini Mishra', 'Real-Estate', true, false),
    ('Pratik Mishra', 'Real-Estate', false, true),
    ('Jayessh Trivedi', 'Real-Estate', false, false),
    ('Khushbu Agarwal', 'Real-Estate', false, false),
    ('Atharva Patankar', 'Real-Estate', false, false),
    ('Kushal Prahladka', 'Real-Estate', false, false),
    ('Poonam Sandu', 'Real-Estate', false, false),
    ('Gauravkumar Nawalgaria', 'Real-Estate', false, false),
    ('Chandrashekhar Amolkar', 'Real-Estate', false, false),

    ('Purvi Jain', 'Lifestyle, Health & Wellness', true, false),
    ('Jinal Vora', 'Lifestyle, Health & Wellness', false, true),
    ('Pooja Shah', 'Lifestyle, Health & Wellness', false, false),
    ('Hrishit Parikh', 'Lifestyle, Health & Wellness', false, false),
    ('Mayur Bhanage', 'Lifestyle, Health & Wellness', false, false),
    ('Shagun Talwar', 'Lifestyle, Health & Wellness', false, false),
    ('Saumil Seetha', 'Lifestyle, Health & Wellness', false, false),
    ('Aniket Bhide', 'Lifestyle, Health & Wellness', false, false),
    ('Bhavana Patel', 'Lifestyle, Health & Wellness', false, false)
)
UPDATE public.members AS member
SET
  power_team = assignment.power_team,
  is_power_team_captain = assignment.is_captain,
  is_power_team_vice_captain = assignment.is_vice_captain
FROM assignments AS assignment
WHERE LOWER(REGEXP_REPLACE(BTRIM(member.first_name || ' ' || member.last_name), '\s+', ' ', 'g'))
    = LOWER(assignment.member_name)
  AND member.is_active = true;

DO $$
DECLARE
  assigned_count integer;
  active_count integer;
  invalid_team_count integer;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM public.members
  WHERE is_active = true AND chapter_role <> 'support';

  SELECT COUNT(*) INTO assigned_count
  FROM public.members
  WHERE is_active = true AND chapter_role <> 'support' AND power_team IS NOT NULL;

  IF active_count <> 37 OR assigned_count <> 37 THEN
    RAISE EXCEPTION 'Expected 37 active chapter members and assignments, found % active and % assigned',
      active_count, assigned_count;
  END IF;

  SELECT COUNT(*) INTO invalid_team_count
  FROM (
    SELECT
      power_team,
      COUNT(*) FILTER (WHERE is_power_team_captain) AS captains,
      COUNT(*) FILTER (WHERE is_power_team_vice_captain) AS vice_captains
    FROM public.members
    WHERE is_active = true AND chapter_role <> 'support'
    GROUP BY power_team
  ) teams
  WHERE captains <> 1 OR vice_captains <> 1;

  IF invalid_team_count <> 0 THEN
    RAISE EXCEPTION 'Every Power Team must have exactly one captain and vice captain';
  END IF;
END;
$$;

COMMIT;
