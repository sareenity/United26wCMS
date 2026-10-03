-- Reconcile committees, coordinator roles, assignments, and power teams with
-- BNI_Roles_Responsibility_Final_LT_United_Oct26-Mar27.xlsx.
-- Abhishek and Vidit are present in the workbook but are not yet CMS members;
-- their power-team assignments must be completed after those member records
-- are created.

BEGIN;

DELETE FROM public.committees;

INSERT INTO public.committees (id, name, committee_group, coordinator_subgroup, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Membership Committee', 'membership', NULL, 1),
  ('c0000000-0000-4000-8000-000000000002', 'Visitor Host Team', 'visitor_host', NULL, 2),
  ('c0000000-0000-4000-8000-000000000003', '121 Coordinators', 'coordinator', '121 Coordinators', 10),
  ('c0000000-0000-4000-8000-000000000004', '30 Sec +Energiser', 'coordinator', '30 Sec +Energiser', 11),
  ('c0000000-0000-4000-8000-000000000005', 'BNI Connect', 'coordinator', 'BNI Connect', 12),
  ('c0000000-0000-4000-8000-000000000006', 'Education Coordinator', 'coordinator', 'Education Coordinator', 13),
  ('c0000000-0000-4000-8000-000000000007', 'FP Coordinators', 'coordinator', 'FP Coordinators', 14),
  ('c0000000-0000-4000-8000-000000000008', 'Go Green Coordinator', 'coordinator', 'Go Green Coordinator', 15),
  ('c0000000-0000-4000-8000-000000000009', 'Business Council coordinator', 'coordinator', 'Business Council coordinator', 16),
  ('c0000000-0000-4000-8000-000000000010', 'Mentor Coordinator', 'coordinator', 'Mentor Coordinator', 17),
  ('c0000000-0000-4000-8000-000000000011', 'Power Date Coordinator', 'coordinator', 'Power Date Coordinator', 18),
  ('c0000000-0000-4000-8000-000000000012', 'Power Team Coordinator', 'coordinator', 'Power Team Coordinator', 19),
  ('c0000000-0000-4000-8000-000000000013', 'Referral, TYFCB and Gives & Ask Coordinator', 'coordinator', 'Referral, TYFCB and Gives & Ask Coordinator', 20),
  ('c0000000-0000-4000-8000-000000000014', 'Social Media', 'coordinator', 'Social Media', 21),
  ('c0000000-0000-4000-8000-000000000015', 'Sports', 'coordinator', 'Sports', 22),
  ('c0000000-0000-4000-8000-000000000016', 'Socials / Events', 'coordinator', 'Socials / Events', 23),
  ('c0000000-0000-4000-8000-000000000017', 'Special Creatives', 'coordinator', 'Special Creatives', 24),
  ('c0000000-0000-4000-8000-000000000018', 'Notable Networker', 'coordinator', 'Notable Networker', 25),
  ('c0000000-0000-4000-8000-000000000019', 'Tech Team / Show Runner', 'coordinator', 'Tech Team / Show Runner', 26),
  ('c0000000-0000-4000-8000-000000000020', 'Testimonial Coordinator', 'coordinator', 'Testimonial Coordinator', 27),
  ('c0000000-0000-4000-8000-000000000021', 'BNI Events & Training', 'coordinator', 'BNI Events & Training', 28),
  ('c0000000-0000-4000-8000-000000000022', 'Lead VHT', 'coordinator', 'Lead VHT', 29),
  ('c0000000-0000-4000-8000-000000000023', 'Venue Co-ordinator', 'coordinator', 'Venue Co-ordinator', 30),
  ('c0000000-0000-4000-8000-000000000024', 'Visitor Orientation', 'coordinator', 'Visitor Orientation', 31),
  ('c0000000-0000-4000-8000-000000000025', 'Door Prize (Sync with FP?)', 'coordinator', 'Door Prize (Sync with FP?)', 32),
  ('c0000000-0000-4000-8000-000000000026', 'Birthday', 'coordinator', 'Birthday', 33),
  ('c0000000-0000-4000-8000-000000000027', 'Growth Coordinator', 'coordinator', 'Growth Coordinator', 34),
  ('c0000000-0000-4000-8000-000000000028', 'Retention Coordintor', 'coordinator', 'Retention Coordintor', 35),
  ('c0000000-0000-4000-8000-000000000029', 'Culture Coordinator', 'coordinator', 'Culture Coordinator', 36),
  ('c0000000-0000-4000-8000-000000000030', 'Women''s Growth Coordinator', 'coordinator', 'Women''s Growth Coordinator', 37);

WITH source_roles (committee_name, owner_name, leads) AS (
  VALUES
    ('Membership Committee', NULL, '{"Pooja Shah":"member","Sanikka Vankadia":"member","Priyanka Gidwani":"member","Hardik Bhanushali":"member","Anuja Shah":"member","Purva Velapure-Gokhale":"member","Atharva Patankar":"member","Shweta Chheda":"member"}'::jsonb),
    ('Visitor Host Team', NULL, '{"Zubin Kutar":"Visitor Host","Purvi Jain":"Visitor Host","Janish Jain":"Visitor Host","Divya Singh":"Visitor Host","Nalini Mishra":"Visitor Host"}'::jsonb),
    ('121 Coordinators', NULL, '{"Jinal Vora":"Coordinator","Poonam Sandu":"Coordinator"}'::jsonb),
    ('30 Sec +Energiser', NULL, '{"Tamanna Mulchandani":"Coordinator","Shagun Talwar":"Coordinator"}'::jsonb),
    ('BNI Connect', NULL, '{"Khushbu Agarwal":"Coordinator","Hardik Bhanushali":"Coordinator"}'::jsonb),
    ('Education Coordinator', NULL, '{"Priyanka Gidwani":"Coordinator","Neisha Arya Saxena":"Coordinator","Rohit Jhunjhunwala":"Coordinator"}'::jsonb),
    ('FP Coordinators', NULL, '{"Sanikka Vankadia":"Coordinator","Shagun Talwar":"Coordinator","Purva Velapure-Gokhale":"Coordinator"}'::jsonb),
    ('Go Green Coordinator', NULL, '{"Chandrashekhar Amolkar":"Coordinator","Zubin Kutar":"Coordinator"}'::jsonb),
    ('Business Council coordinator', NULL, '{"Priyanka Gidwani":"Coordinator","Hrishit Parikh":"Coordinator"}'::jsonb),
    ('Mentor Coordinator', 'Bhavana Patel', '{"Sanikka Vankadia":"Coordinator","Nikhil Gala":"Coordinator"}'::jsonb),
    ('Power Date Coordinator', NULL, '{"Chandrashekhar Amolkar":"Coordinator","Jayessh Trivedi":"Coordinator","Pooja Shah":"Coordinator"}'::jsonb),
    ('Power Team Coordinator', NULL, '{"Rohit Jhunjhunwala":"Coordinator","Saumil Seetha":"Coordinator","Nalini Mishra":"Coordinator"}'::jsonb),
    ('Referral, TYFCB and Gives & Ask Coordinator', NULL, '{"Jinal Vora":"Coordinator","Khushbu Agarwal":"Coordinator"}'::jsonb),
    ('Social Media', NULL, '{"Adnan Vahanvaty":"Coordinator","Sachin Pawar":"Coordinator","Purvi Jain":"Coordinator"}'::jsonb),
    ('Sports', NULL, '{"Atharva Patankar":"Coordinator","Kushal Prahladka":"Coordinator","Purvi Jain":"Coordinator"}'::jsonb),
    ('Socials / Events', NULL, '{"Divya Singh":"Coordinator","Chandrashekhar Amolkar":"Coordinator","Kushal Prahladka":"Coordinator","Adnan Vahanvaty":"Coordinator","Tamanna Mulchandani":"Coordinator"}'::jsonb),
    ('Special Creatives', NULL, '{"Rushi Thar":"Coordinator","Adnan Vahanvaty":"Coordinator","Sachin Pawar":"Coordinator"}'::jsonb),
    ('Notable Networker', NULL, '{"Kushal Prahladka":"Coordinator","Mayur Bhanage":"Coordinator","Ankit Surolia":"Coordinator"}'::jsonb),
    ('Tech Team / Show Runner', NULL, '{"Divya Singh":"Coordinator","Zubin Kutar":"Coordinator","Anuja Shah":"Coordinator","Gauravkumar Nawalgaria":"Mic Runner","Pratik Mishra":"Mic Runner","Shagun Talwar":"Time Keeper","Neisha Arya Saxena":"Time Keeper"}'::jsonb),
    ('Testimonial Coordinator', NULL, '{"Ankit Surolia":"Coordinator","Mayur Bhanage":"Coordinator"}'::jsonb),
    ('BNI Events & Training', NULL, '{"Neisha Arya Saxena":"Coordinator","Rohit Jhunjhunwala":"Coordinator","Priyanka Gidwani":"Coordinator"}'::jsonb),
    ('Lead VHT', 'Sahil Amesur', '{"Jayessh Trivedi":"Coordinator","Shweta Chheda":"Coordinator","Sanikka Vankadia":"Coordinator"}'::jsonb),
    ('Venue Co-ordinator', 'Sahil Amesur', '{"Shweta Chheda":"Coordinator"}'::jsonb),
    ('Visitor Orientation', 'Bhavana Patel', '{"Pooja Shah":"Coordinator","Anuja Shah":"Coordinator","Nikhil Gala":"Coordinator","Priyanka Gidwani":"Coordinator","Chandrashekhar Amolkar":"Coordinator","Hardik Bhanushali":"Coordinator"}'::jsonb),
    ('Door Prize (Sync with FP?)', 'Sahil Amesur', '{"Sanikka Vankadia":"Coordinator","Purva Velapure-Gokhale":"Coordinator"}'::jsonb),
    ('Birthday', NULL, '{"Poonam Sandu":"Coordinator","Tamanna Mulchandani":"Coordinator"}'::jsonb),
    ('Growth Coordinator', 'Bhavana Patel', '{"Hardik Bhanushali":"Coordinator","Khushbu Agarwal":"Coordinator"}'::jsonb),
    ('Retention Coordintor', 'Bhavana Patel', '{"Pooja Shah":"Coordinator","Rushi Thar":"Coordinator"}'::jsonb),
    ('Culture Coordinator', NULL, '{"Adnan Vahanvaty":"Coordinator","Rushi Thar":"Coordinator"}'::jsonb),
    ('Women''s Growth Coordinator', NULL, '{"Poonam Sandu":"Coordinator","Shagun Talwar":"Coordinator"}'::jsonb)
), assignments AS (
  SELECT committee_name, owner_name AS member_name, 'Owner'::text AS role
  FROM source_roles
  WHERE owner_name IS NOT NULL
  UNION ALL
  SELECT source_roles.committee_name, lead.key AS member_name, lead.value AS role
  FROM source_roles
  CROSS JOIN LATERAL jsonb_each_text(source_roles.leads) AS lead
)
INSERT INTO public.committee_members (committee_id, member_id, role)
SELECT committee.id, member.id, assignment.role
FROM assignments assignment
JOIN public.committees committee ON committee.name = assignment.committee_name
JOIN public.members member
  ON LOWER(REGEXP_REPLACE(BTRIM(member.first_name || ' ' || member.last_name), '\s+', ' ', 'g'))
   = LOWER(assignment.member_name);

DO $$
DECLARE
  assignment_count integer;
BEGIN
  SELECT COUNT(*) INTO assignment_count FROM public.committee_members;
  IF assignment_count <> 97 THEN
    RAISE EXCEPTION 'Expected 97 committee assignments after excluding leadership owners, inserted %', assignment_count;
  END IF;
END;
$$;

UPDATE public.members
SET
  power_team = NULL,
  is_power_team_captain = false,
  is_power_team_vice_captain = false
WHERE chapter_role <> 'support';

WITH power_team_assignments (member_name, power_team, is_captain, is_vice_captain) AS (
  VALUES
    ('Priyanka Gidwani', 'Corporate', true, false),
    ('Hardik Bhanushali', 'Corporate', false, true),
    ('Purva Velapure-Gokhale', 'Corporate', false, false),
    ('Janish Jain', 'Corporate', false, false),
    ('Divya Singh', 'Corporate', false, false),
    ('Ankit Surolia', 'Corporate', false, false),
    ('Adnan Vahanvaty', 'Marketing & Branding', true, false),
    ('Zubin Kutar', 'Marketing & Branding', false, true),
    ('Sahil Amesur', 'Marketing & Branding', false, false),
    ('Sachin Pawar', 'Marketing & Branding', false, false),
    ('Rushi Thar', 'Marketing & Branding', false, false),
    ('Abhishek', 'Marketing & Branding', false, false),
    ('Sanikka Vankadia', 'MSME', true, false),
    ('Rohit Jhunjhunwala', 'MSME', false, true),
    ('Rohit DK Sareen', 'MSME', false, false),
    ('Shweta Chheda', 'MSME', false, false),
    ('Nikhil Gala', 'MSME', false, false),
    ('Anuja Shah', 'MSME', false, false),
    ('Nalini Mishra', 'Real-Estate', true, false),
    ('Pratik Mishra', 'Real-Estate', false, true),
    ('Jayessh Trivedi', 'Real-Estate', false, false),
    ('Khushbu Agarwal', 'Real-Estate', false, false),
    ('Atharva Patankar', 'Real-Estate', false, false),
    ('Kushal Prahladka', 'Real-Estate', false, false),
    ('Poonam Sandu', 'Real-Estate', false, false),
    ('Vidit', 'Real-Estate', false, false),
    ('Purvi Jain', 'Lifestyle', true, false),
    ('Pooja Shah', 'Lifestyle', false, true),
    ('Tamanna Mulchandani', 'Lifestyle', false, false),
    ('Hrishit Parikh', 'Lifestyle', false, false),
    ('Mayur Bhanage', 'Lifestyle', false, false),
    ('Shagun Talwar', 'Lifestyle', false, false),
    ('Gauravkumar Nawalgaria', 'Lifestyle', false, false),
    ('Chandrashekhar Amolkar', 'Wellness', true, false),
    ('Aniket Bhide', 'Wellness', false, true),
    ('Saumil Seetha', 'Wellness', false, false),
    ('Jinal Vora', 'Wellness', false, false),
    ('Bhavana Patel', 'Wellness', false, false),
    ('Neisha Arya Saxena', 'Wellness', false, false)
)
UPDATE public.members member
SET
  power_team = assignment.power_team,
  is_power_team_captain = assignment.is_captain,
  is_power_team_vice_captain = assignment.is_vice_captain
FROM power_team_assignments assignment
WHERE LOWER(REGEXP_REPLACE(BTRIM(member.first_name || ' ' || member.last_name), '\s+', ' ', 'g'))
    = LOWER(assignment.member_name);

DO $$
DECLARE
  missing_names text;
BEGIN
  WITH expected (member_name) AS (
    VALUES ('Abhishek'), ('Vidit')
  )
  SELECT STRING_AGG(expected.member_name, ', ' ORDER BY expected.member_name)
  INTO missing_names
  FROM expected
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.members member
    WHERE LOWER(REGEXP_REPLACE(BTRIM(member.first_name || ' ' || member.last_name), '\s+', ' ', 'g'))
      = LOWER(expected.member_name)
  );

  IF missing_names IS NOT NULL THEN
    RAISE NOTICE 'Spreadsheet power-team members not yet in CMS: %', missing_names;
  END IF;
END;
$$;

COMMIT;
