
-- Drop if partial
DROP TABLE IF EXISTS committee_members CASCADE;
DROP TABLE IF EXISTS committees CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  business_category text NOT NULL,
  company_name text,
  phone text,
  email text,
  photo_url text,
  chapter_role text DEFAULT 'member',
  power_team text,
  is_power_team_captain boolean DEFAULT false,
  is_power_team_vice_captain boolean DEFAULT false,
  tagline text,
  website text,
  sort_order integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Committees table
CREATE TABLE committees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  committee_group text NOT NULL,
  coordinator_subgroup text,
  sort_order integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Committee members junction
CREATE TABLE committee_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id uuid REFERENCES committees(id) ON DELETE CASCADE,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;

-- Public read access (anon)
CREATE POLICY "public_read_members" ON members FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_committees" ON committees FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_committee_members" ON committee_members FOR SELECT TO anon USING (true);

-- Authenticated full access
CREATE POLICY "auth_insert_members" ON members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_members" ON members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_members" ON members FOR DELETE TO authenticated USING (true);
CREATE POLICY "auth_insert_committees" ON committees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_committees" ON committees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_committees" ON committees FOR DELETE TO authenticated USING (true);
CREATE POLICY "auth_insert_committee_members" ON committee_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_committee_members" ON committee_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_committee_members" ON committee_members FOR DELETE TO authenticated USING (true);

-- Seed: Support team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, tagline, sort_order) VALUES
('Nikhil', 'Desai', 'BNI Support', 'BNI Mumbai', 'support', 'Area Director Consultant', 1),
('Anosh', 'Kanga', 'BNI Support', 'BNI Mumbai', 'support', 'Sr. Director Consultant', 2),
('Mihir', 'Mehta', 'BNI Support', 'BNI Mumbai', 'support', 'Director Consultant', 3),
('Ganesh', 'Pisat', 'BNI Support', 'BNI Mumbai', 'support', 'Ambassador', 4);

-- Seed: Leadership
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, power_team, tagline, sort_order) VALUES
('Priyanka', 'Gidwani', 'Numerologist', 'Priyanka Gidwani Numerology', 'leadership', 'Corporate', 'President', 10),
('Sanikka', 'Vankadia', 'Digital Marketing', 'DigiVerse Solutions', 'leadership', 'MSME', 'Vice President', 11),
('Janish', 'Jain', 'Interior Designer', 'Janish Design Studio', 'leadership', 'Corporate', 'Secretary Treasurer', 12);

-- Seed: Corporate Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Hardik', 'Bhanushali', 'Event Management', 'Hardik Events', 'member', 'Corporate', true, false, 20),
('Kanishka', 'Ramchandani', 'Corporate Gifting', 'Gift Studio', 'member', 'Corporate', false, true, 21),
('Adnan', 'Merchant', 'Travel & Hospitality', 'Merchant Travels', 'member', 'Corporate', false, false, 22),
('Harsh', 'Jain', 'Chartered Accountant', 'Harsh & Associates', 'member', 'Corporate', false, false, 23),
('Vaishali', 'Nair', 'HR Consultant', 'HR Solutions India', 'member', 'Corporate', false, false, 24),
('Nisha', 'Punjabi', 'Financial Advisor', 'Nisha Finance', 'member', 'Corporate', false, false, 25),
('Kiran', 'Shetty', 'Insurance', 'Shetty Insurance', 'member', 'Corporate', false, false, 26),
('Rohan', 'Shah', 'IT Services', 'Shah Tech', 'member', 'Corporate', false, false, 27),
('Pooja', 'Mehta', 'Marketing Consultant', 'Pooja Marketing', 'member', 'Corporate', false, false, 28),
('Amit', 'Kapoor', 'Printing & Branding', 'Kapoor Print', 'member', 'Corporate', false, false, 29);

-- Seed: Lifestyle & Wellness Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Shagun', 'Talwar', 'Wellness Coach', 'Shagun Wellness', 'member', 'Lifestyle & Wellness', true, false, 30),
('Hrishit', 'Parikh', 'Fitness Trainer', 'Hrishit Fitness', 'member', 'Lifestyle & Wellness', false, true, 31),
('Deepika', 'Sharma', 'Yoga Instructor', 'Deepika Yoga Studio', 'member', 'Lifestyle & Wellness', false, false, 32),
('Ravi', 'Patel', 'Ayurvedic Doctor', 'Patel Ayurveda Clinic', 'member', 'Lifestyle & Wellness', false, false, 33),
('Sunita', 'Gupta', 'Nutritionist', 'Gupta Nutrition', 'member', 'Lifestyle & Wellness', false, false, 34),
('Ananya', 'Verma', 'Life Coach', 'Ananya Life Coaching', 'member', 'Lifestyle & Wellness', false, false, 35),
('Ketan', 'Joshi', 'Dermatologist', 'Joshi Skin Clinic', 'member', 'Lifestyle & Wellness', false, false, 36),
('Meera', 'Pillai', 'Dance Therapist', 'Meera Dance Academy', 'member', 'Lifestyle & Wellness', false, false, 37),
('Vikram', 'Nair', 'Sports Nutritionist', 'Vikram Sports Science', 'member', 'Lifestyle & Wellness', false, false, 38),
('Anjali', 'Desai', 'Holistic Healer', 'Anjali Healing Centre', 'member', 'Lifestyle & Wellness', false, false, 39);

-- Seed: MSME Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Rohit', 'Jhunjhunwala', 'Business Consultant', 'Rohit Consulting', 'member', 'MSME', true, false, 40),
('Rohit DK', 'Sareen', 'Manufacturing', 'Sareen Industries', 'member', 'MSME', false, true, 41),
('Preeti', 'Singh', 'Export-Import', 'Singh Exports', 'member', 'MSME', false, false, 42),
('Manish', 'Agarwal', 'Packaging Solutions', 'Agarwal Pack', 'member', 'MSME', false, false, 43),
('Rakesh', 'Rao', 'Logistics', 'Rao Logistics', 'member', 'MSME', false, false, 44),
('Shweta', 'Bhatt', 'Accounting Services', 'Bhatt Accounts', 'member', 'MSME', false, false, 45),
('Dinesh', 'Modi', 'Engineering Services', 'Modi Engineering', 'member', 'MSME', false, false, 46),
('Kavya', 'Reddy', 'Textile & Apparel', 'Reddy Textiles', 'member', 'MSME', false, false, 47),
('Suresh', 'Kumar', 'Food Processing', 'Kumar Foods', 'member', 'MSME', false, false, 48),
('Priti', 'Shah', 'Jewellery', 'Shah Jewellers', 'member', 'MSME', false, false, 49);

-- Seed: Property Power Team
INSERT INTO members (first_name, last_name, business_category, company_name, chapter_role, power_team, is_power_team_captain, is_power_team_vice_captain, sort_order) VALUES
('Chandrashekhar', 'Amolkar', 'Real Estate', 'Amolkar Realty', 'member', 'Property', true, false, 50),
('Nalini', 'Mishra', 'Interior Design', 'Nalini Interiors', 'member', 'Property', false, true, 51),
('Vishal', 'Tiwari', 'Architecture', 'Tiwari Architects', 'member', 'Property', false, false, 52),
('Rekha', 'Joshi', 'Property Legal', 'Joshi Legal Services', 'member', 'Property', false, false, 53),
('Sanjay', 'Patil', 'Home Loans', 'Patil Finance', 'member', 'Property', false, false, 54),
('Lata', 'Kulkarni', 'Vastu Consultant', 'Kulkarni Vastu', 'member', 'Property', false, false, 55),
('Nitin', 'Desai', 'Property Management', 'Desai Properties', 'member', 'Property', false, false, 56),
('Shruti', 'Wagh', 'Landscape Design', 'Wagh Landscape', 'member', 'Property', false, false, 57),
('Manoj', 'Pawar', 'Civil Contractor', 'Pawar Constructions', 'member', 'Property', false, false, 58),
('Geeta', 'Rane', 'Property Broker', 'Rane Properties', 'member', 'Property', false, false, 59);

-- Seed: Committees
INSERT INTO committees (name, committee_group, coordinator_subgroup, sort_order) VALUES
('Membership Committee', 'membership', NULL, 1),
('Visitor Host Team', 'visitor_host', NULL, 2),
('Education Coordinator', 'coordinator', 'Education Coordinator', 10),
('Social Media Coordinator', 'coordinator', 'Social Media Coordinator', 11),
('Newsletter Coordinator', 'coordinator', 'Newsletter Coordinator', 12),
('Visitor Host Coordinator', 'coordinator', 'Visitor Host Coordinator', 13),
('Mentorship Coordinator', 'coordinator', 'Mentorship Coordinator', 14),
('Treasurer Assistant', 'coordinator', 'Treasurer Assistant', 15),
('Secretary Assistant', 'coordinator', 'Secretary Assistant', 16),
('PALMS Coordinator', 'coordinator', 'PALMS Coordinator', 17),
('BNI Connect Coordinator', 'coordinator', 'BNI Connect Coordinator', 18),
('Event Coordinator', 'coordinator', 'Event Coordinator', 19),
('Referral Coordinator', 'coordinator', 'Referral Coordinator', 20),
('Recognition Coordinator', 'coordinator', 'Recognition Coordinator', 21),
('Chapter Growth Coordinator', 'coordinator', 'Chapter Growth Coordinator', 22),
('CEU Coordinator', 'coordinator', 'CEU Coordinator', 23),
('Substitutes Coordinator', 'coordinator', 'Substitutes Coordinator', 24),
('1-2-1 Coordinator', 'coordinator', '1-2-1 Coordinator', 25),
('Charity Coordinator', 'coordinator', 'Charity Coordinator', 26),
('Technology Coordinator', 'coordinator', 'Technology Coordinator', 27),
('BNI Foundation Coordinator', 'coordinator', 'BNI Foundation Coordinator', 28);

-- Assign committee members (sample assignments using subqueries)
INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'chair'
FROM committees c, members m
WHERE c.name = 'Membership Committee' AND m.first_name = 'Priyanka' AND m.last_name = 'Gidwani';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Membership Committee' AND m.first_name = 'Hardik' AND m.last_name = 'Bhanushali';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Membership Committee' AND m.first_name = 'Kanishka' AND m.last_name = 'Ramchandani';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Membership Committee' AND m.first_name = 'Rohit' AND m.last_name = 'Jhunjhunwala';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Membership Committee' AND m.first_name = 'Chandrashekhar' AND m.last_name = 'Amolkar';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'chair'
FROM committees c, members m
WHERE c.name = 'Visitor Host Team' AND m.first_name = 'Sanikka' AND m.last_name = 'Vankadia';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Visitor Host Team' AND m.first_name = 'Shagun' AND m.last_name = 'Talwar';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Visitor Host Team' AND m.first_name = 'Hrishit' AND m.last_name = 'Parikh';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Visitor Host Team' AND m.first_name = 'Nalini' AND m.last_name = 'Mishra';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'member'
FROM committees c, members m
WHERE c.name = 'Visitor Host Team' AND m.first_name = 'Adnan' AND m.last_name = 'Merchant';

-- Coordinator assignments
INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Education Coordinator' AND m.first_name = 'Janish' AND m.last_name = 'Jain';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Social Media Coordinator' AND m.first_name = 'Sanikka' AND m.last_name = 'Vankadia';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Newsletter Coordinator' AND m.first_name = 'Pooja' AND m.last_name = 'Mehta';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Visitor Host Coordinator' AND m.first_name = 'Adnan' AND m.last_name = 'Merchant';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Mentorship Coordinator' AND m.first_name = 'Hardik' AND m.last_name = 'Bhanushali';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Treasurer Assistant' AND m.first_name = 'Harsh' AND m.last_name = 'Jain';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Secretary Assistant' AND m.first_name = 'Vaishali' AND m.last_name = 'Nair';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'PALMS Coordinator' AND m.first_name = 'Kanishka' AND m.last_name = 'Ramchandani';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'BNI Connect Coordinator' AND m.first_name = 'Rohan' AND m.last_name = 'Shah';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Event Coordinator' AND m.first_name = 'Amit' AND m.last_name = 'Kapoor';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Referral Coordinator' AND m.first_name = 'Nisha' AND m.last_name = 'Punjabi';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Recognition Coordinator' AND m.first_name = 'Kiran' AND m.last_name = 'Shetty';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Chapter Growth Coordinator' AND m.first_name = 'Priyanka' AND m.last_name = 'Gidwani';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'CEU Coordinator' AND m.first_name = 'Shagun' AND m.last_name = 'Talwar';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Substitutes Coordinator' AND m.first_name = 'Hrishit' AND m.last_name = 'Parikh';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = '1-2-1 Coordinator' AND m.first_name = 'Rohit' AND m.last_name = 'Jhunjhunwala';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Charity Coordinator' AND m.first_name = 'Deepika' AND m.last_name = 'Sharma';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'Technology Coordinator' AND m.first_name = 'Rohan' AND m.last_name = 'Shah';

INSERT INTO committee_members (committee_id, member_id, role)
SELECT c.id, m.id, 'coordinator'
FROM committees c, members m
WHERE c.name = 'BNI Foundation Coordinator' AND m.first_name = 'Chandrashekhar' AND m.last_name = 'Amolkar';
