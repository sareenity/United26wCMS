
-- Clear all existing data (cascade handles FK constraints)
TRUNCATE members CASCADE;
TRUNCATE committees CASCADE;

-- ============================================================
-- MEMBERS
-- ============================================================

-- Support team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, tagline, sort_order) VALUES
('Nikhil', 'Desai', 'BNI Support', 'BNI Mumbai West 1', 'support', 'Area Director Consultant', 1),
('Anosh', 'Kanga', 'BNI Support', 'BNI Mumbai West 1', 'support', 'Sr. Director Consultant', 2),
('Mihir', 'Mehta', 'BNI Support', 'BNI Mumbai West 1', 'support', 'Director Consultant', 3),
('Ganesh', 'Pisat', 'BNI Support', 'BNI Mumbai West 1', 'support', 'Ambassador', 4);

-- Leadership team
INSERT INTO members (first_name, last_name, business_category, company_name, phone, email, chapter_role, power_team, tagline, sort_order) VALUES
('Priyanka', 'Gidwani', 'CHRO Services', 'PG ALL THINGS PEOPLE', '+91-9136861972', 'pgidwani@allthingspeople.in', 'leadership', 'Corporate', 'President', 10),
('Sanikka', 'Vankadia', 'Life Insurance', NULL, '+91-9819507446', 'info@prosperomoney.net', 'leadership', 'MSME', 'Vice President', 11),
('Janish', 'Jain', 'IT Hardware - Sales & Service', 'RAJSHREE SYSTEMS AND TECHNOLOGY', '+91-7506774649', 'janish@rajshreesystems.com', 'leadership', 'Corporate', 'Secretary Treasurer', 12);

-- Corporate Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, phone, email, website, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Hardik', 'Bhanushali', 'Mutual Fund Advisor', 'HAPPYLIFE FINSERV', '+91-9967934144', 'ngbmf@yahoo.com', NULL, 'member', 'Corporate', true, false, 20),
('Kanishka', 'Ramchandani', 'Content Writer', 'WORD MONK', '+91-9619544787', 'kanishka@wordmonk.in', NULL, 'member', 'Corporate', false, true, 21),
('Adnan', 'Vahanvaty', 'Graphic Designer', 'ODMINT ENTERPRISES', NULL, NULL, NULL, 'member', 'Corporate', false, false, 22),
('Bindu', 'Gupta', 'Image Consultant', 'LUMINARA TRANSFORMATION HUB', '+91-9930653150', 'connect.luminara@gmail.com', NULL, 'member', 'Corporate', false, false, 23),
('Divya', 'Singh', 'Corporate Gifting - Homeware', 'AGAPE4U', '+91-9082250677', 'agape4uu@gmail.com', 'agape4u.com', 'member', 'Corporate', false, false, 24),
('Purva', 'Velapure-Gokhale', 'Interior Designer - Commercial', 'D20 ELEMENTS', '+91-9910084529', 'meetpurva@d20elements.com', NULL, 'member', 'Corporate', false, false, 25),
('Rushi', 'Thar', 'Printing', 'KRIATION', '+91-9820019791', 'rt@kriation.in', 'kriation.in', 'member', 'Corporate', false, false, 26),
('Yash', 'Renukdas', 'Video Content Creator - Corporate', 'SUPERCUT STUDIOS', '+91-9987442535', 'yash@supercutstudios.co', NULL, 'member', 'Corporate', false, false, 27),
('Zubin', 'Kutar', 'AI Trainer', 'AI FLUENCY LABS', '+91-9820320013', 'zubinkutar@gmail.com', NULL, 'member', 'Corporate', false, false, 28);

-- Lifestyle & Wellness Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, phone, email, website, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Shagun', 'Talwar', 'Baker', 'TAKEONEDOUGH', '+91-9833303235', 'takeonedough2020@gmail.com', NULL, 'member', 'Lifestyle & Wellness', true, false, 30),
('Hrishit', 'Parikh', 'Diamond Jewellery', 'VINI DIAMONDS AND JEWELLERY', '+91-9687662888', 'hrishparikh@gmail.com', NULL, 'member', 'Lifestyle & Wellness', false, true, 31),
('Jinal', 'Vora', 'Nutritionist', 'AMAYUSH', '+91-9821261723', 'jinalv85@gmail.com', 'amayushbyjinal.com', 'member', 'Lifestyle & Wellness', false, false, 32),
('Mayur', 'Bhanage', 'Wedding and Event - Photo & Video', 'PICS AND VIBES', '+91-9664112655', 'mbhanage3@gmail.com', NULL, 'member', 'Lifestyle & Wellness', false, false, 33),
('Neisha Arya', 'Saxena', 'Essential Oils', 'ESSENTIALLY YOURS', '+91-9820280129', 'neisha_arya@rediffmail.com', NULL, 'member', 'Lifestyle & Wellness', false, false, 34),
('Pooja', 'Shah', 'Tours & Travel', 'MASTI VOYAGE', '+91-9820477055', 'mastivoyage@gmail.com', 'mastivoyage.in', 'member', 'Lifestyle & Wellness', false, false, 35),
('Saumil', 'Seetha', 'Saumil Wellness - Rudraksha Expert', 'RUDRALIFE', '+91-9320077017', 'saumilseethawork@gmail.com', 'www.rudralife.com', 'member', 'Lifestyle & Wellness', false, false, 36),
('Tamanna', 'Mulchandani', 'Icecreams and Popsicles', 'THE ICE DREAM CO.', '+91-9699984900', 'theicedreamco@gmail.com', 'theicedream.co.com', 'member', 'Lifestyle & Wellness', false, false, 37),
('Udita', 'Doshi', 'Event Decoration', 'HOUSE OF MARIGOLD', '+91-9769884379', 'uditamehta.95@gmail.com', NULL, 'member', 'Lifestyle & Wellness', false, false, 38);

-- MSME Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, phone, email, website, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Rohit', 'Jhunjhunwala', 'CA - Direct Taxes', 'R JHUNJHUNWALA AND ASSOCIATES', '+91-9820674200', 'cajhunjhunwalarohit@gmail.com', NULL, 'member', 'MSME', true, false, 40),
('Rohit DK', 'Sareen', 'Process Consultant - Artificial Intelligence', 'SCALRAIX SYSTEMS PVT. LTD.', '+91-9820462082', 'rohit@scalraix.com', NULL, 'member', 'MSME', false, true, 41),
('Ankit', 'Surolia', 'GST Consultant', 'SUROLIA & ASSOCIATES', '+91-9768772937', 'caankitsurolia@gmail.com', NULL, 'member', 'MSME', false, false, 42),
('Anuja', 'Shah', 'Debt Investments', 'MIDAS FINANCE', '+91-9619086861', 'anuja.shah@midasfin.in', NULL, 'member', 'MSME', false, false, 43),
('Bhavana', 'Patel', 'Emotional Freedom Coach', 'HOLISTIC SUCCESS HUB', '+91-9619472509', 'patelbhavna2912@gmail.com', NULL, 'member', 'MSME', false, false, 44),
('Nikhil', 'Gala', 'General Insurance', 'GALA INSURANCE', '+91-9892475555', 'sales@galainsurance.in', NULL, 'member', 'MSME', false, false, 45),
('Sachin', 'Pawar', 'Digital Marketing', 'DFOX MEDIA', '+91-8898002303', 'sachin@dfoxmedia.com', 'dfoxmedia.com', 'member', 'MSME', false, false, 46),
('Sahil', 'Amesur', 'Commercial Photography', 'SYNSFOURTH', '+91-9833769638', 'designondemandbysf@gmail.com', 'yourdesignondemand.com', 'member', 'MSME', false, false, 47),
('Shweta', 'Chheda', 'Portfolio Management Services', 'JAIN INVESTMENT ADVISORS PVT LTD', '+91-9619947705', 'shweta@jaininvestment.com', NULL, 'member', 'MSME', false, false, 48);

-- Property Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, phone, email, website, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Chandrashekhar', 'Amolkar', 'Vaastu Consultant', 'THEVAASTUGURU', '+91-9619579937', 'chandrashekhar.amolkar@gmail.com', NULL, 'member', 'Property', true, false, 50),
('Nalini', 'Mishra', 'Pipes and Valves Manufacturer', 'VB VALVES PVT LTD', '+91-9820372339', 'nalinibibbo@gmail.com', 'vbvalvepvtltd.com', 'member', 'Property', false, true, 51),
('Atharva', 'Patankar', 'Environmental Waste Management Solutions', 'GREYEAST TECHNOLOGIES PVT. LTD.', '+91-9730888319', 'aspa@greyeast.in', NULL, 'member', 'Property', false, false, 52),
('Jayessh', 'Trivedi', 'Property and RERA Law', 'JURIS CIVILIS', '+91-9136971999', 'juriscivilis.jt@gmail.com', NULL, 'member', 'Property', false, false, 53),
('Khushbu', 'Agarwal', 'LED Lights', 'PINFUSE AUTOMATION LLP', '+91-7738206602', 'khushbuchheda@hotmail.com', NULL, 'member', 'Property', false, false, 54),
('Kushal', 'Prahladka', 'Turnkey Contractor', 'SHRINKAA', '+91-9769616506', 'info@shrinkaa.com', NULL, 'member', 'Property', false, false, 55),
('Poonam', 'Sandu', 'Interior Design - Residential', 'INTERIOR SPACES', '+91-9820286324', 'poonam.sandu@gmail.com', NULL, 'member', 'Property', false, false, 56);

-- ============================================================
-- COMMITTEES
-- ============================================================
INSERT INTO committees (name, committee_group, coordinator_subgroup, sort_order) VALUES
('Membership Committee', 'membership', NULL, 1),
('Visitor Host Team', 'visitor_host', NULL, 2),
('Feature Presentation', 'coordinator', 'Feature Presentation', 10),
('Power Team Coordinator', 'coordinator', 'Power Team Coordinator', 11),
('Lead Visitor Host', 'coordinator', 'Lead Visitor Host', 12),
('Creative', 'coordinator', 'Creative', 13),
('Brand Custodian', 'coordinator', 'Brand Custodian', 14),
('Technical Team', 'coordinator', 'Technical Team', 15),
('Women Growth', 'coordinator', 'Women Growth', 16),
('Growth and Retention', 'coordinator', 'Growth and Retention', 17),
('121', 'coordinator', '121', 18),
('Mentor', 'coordinator', 'Mentor', 19),
('PIO / OV', 'coordinator', 'PIO / OV', 20),
('Socials', 'coordinator', 'Socials', 21),
('BNI Connect', 'coordinator', 'BNI Connect', 22),
('Social Media', 'coordinator', 'Social Media', 23),
('Business Council', 'coordinator', 'Business Council', 24),
('Go-Green', 'coordinator', 'Go-Green', 25),
('Time Keepers', 'coordinator', 'Time Keepers', 26),
('Gives and Asks', 'coordinator', 'Gives and Asks', 27),
('Culture', 'coordinator', 'Culture', 28),
('Sports', 'coordinator', 'Sports', 29);

-- ============================================================
-- COMMITTEE MEMBERS
-- ============================================================

-- Membership Committee (8 members)
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Membership Committee';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Anuja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Bhavana' AND last_name='Patel';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Chandrashekhar' AND last_name='Amolkar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Kanishka' AND last_name='Ramchandani';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Khushbu' AND last_name='Agarwal';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Nikhil' AND last_name='Gala';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Pooja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'member' FROM members WHERE first_name='Rohit' AND last_name='Jhunjhunwala';
END $$;

-- Visitor Host Team
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Visitor Host Team';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Lead Visitor Host' FROM members WHERE first_name='Anuja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Lead Visitor Host' FROM members WHERE first_name='Bindu' AND last_name='Gupta';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Lead Visitor Host' FROM members WHERE first_name='Sachin' AND last_name='Pawar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Atharva' AND last_name='Patankar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Jayessh' AND last_name='Trivedi';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Mayur' AND last_name='Bhanage';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Neisha Arya' AND last_name='Saxena';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Shweta' AND last_name='Chheda';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Host' FROM members WHERE first_name='Udita' AND last_name='Doshi';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Orientation Specialist' FROM members WHERE first_name='Rohit' AND last_name='Jhunjhunwala';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Orientation Specialist' FROM members WHERE first_name='Pooja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'Visitor Orientation Specialist' FROM members WHERE first_name='Nikhil' AND last_name='Gala';
END $$;

-- Feature Presentation
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Feature Presentation';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Khushbu' AND last_name='Agarwal';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Purva' AND last_name='Velapure-Gokhale';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Bhavana' AND last_name='Patel';
END $$;

-- Power Team Coordinator
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Power Team Coordinator';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Anuja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Udita' AND last_name='Doshi';
END $$;

-- Lead Visitor Host (coordinator)
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Lead Visitor Host';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Neisha Arya' AND last_name='Saxena';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Shweta' AND last_name='Chheda';
END $$;

-- Creative
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Creative';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Kanishka' AND last_name='Ramchandani';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Rushi' AND last_name='Thar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Sachin' AND last_name='Pawar';
END $$;

-- Brand Custodian
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Brand Custodian';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Rushi' AND last_name='Thar';
END $$;

-- Technical Team
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Technical Team';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Anuja' AND last_name='Shah';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Kushal' AND last_name='Prahladka';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Yash' AND last_name='Renukdas';
END $$;

-- Women Growth
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Women Growth';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Bhavana' AND last_name='Patel';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Bindu' AND last_name='Gupta';
END $$;

-- Growth and Retention
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Growth and Retention';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Chandrashekhar' AND last_name='Amolkar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Pooja' AND last_name='Shah';
END $$;

-- 121
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='121';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Bindu' AND last_name='Gupta';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Jinal' AND last_name='Vora';
END $$;

-- Mentor
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Mentor';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Kushal' AND last_name='Prahladka';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Udita' AND last_name='Doshi';
END $$;

-- PIO / OV
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='PIO / OV';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Khushbu' AND last_name='Agarwal';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Rohit' AND last_name='Jhunjhunwala';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Pooja' AND last_name='Shah';
END $$;

-- Socials
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Socials';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Neisha Arya' AND last_name='Saxena';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Tamanna' AND last_name='Mulchandani';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Yash' AND last_name='Renukdas';
END $$;

-- BNI Connect
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='BNI Connect';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Hardik' AND last_name='Bhanushali';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Sachin' AND last_name='Pawar';
END $$;

-- Social Media
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Social Media';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Kanishka' AND last_name='Ramchandani';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Sahil' AND last_name='Amesur';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Sachin' AND last_name='Pawar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Tamanna' AND last_name='Mulchandani';
END $$;

-- Business Council
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Business Council';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Hrishit' AND last_name='Parikh';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Sachin' AND last_name='Pawar';
END $$;

-- Go-Green
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Go-Green';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Nikhil' AND last_name='Gala';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Chandrashekhar' AND last_name='Amolkar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Pooja' AND last_name='Shah';
END $$;

-- Time Keepers
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Time Keepers';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Bindu' AND last_name='Gupta';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Nalini' AND last_name='Mishra';
END $$;

-- Gives and Asks
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Gives and Asks';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Jinal' AND last_name='Vora';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Purva' AND last_name='Velapure-Gokhale';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Shweta' AND last_name='Chheda';
END $$;

-- Culture
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Culture';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Jinal' AND last_name='Vora';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Neisha Arya' AND last_name='Saxena';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Rushi' AND last_name='Thar';
END $$;

-- Sports
DO $$ DECLARE cid uuid; BEGIN
SELECT id INTO cid FROM committees WHERE name='Sports';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Atharva' AND last_name='Patankar';
INSERT INTO committee_members (committee_id, member_id, role) SELECT cid, id, 'coordinator' FROM members WHERE first_name='Kushal' AND last_name='Prahladka';
END $$;
