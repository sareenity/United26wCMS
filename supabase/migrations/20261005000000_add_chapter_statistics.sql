/*
# Editable Chapter Statistics

Stores the four public statistic groups shown on the homepage. Everyone may
read these values, while writes are restricted to the service role used by the
authenticated CMS edge function.
*/

CREATE TABLE IF NOT EXISTS chapter_statistics (
  region text PRIMARY KEY CHECK (region IN ('worldwide', 'india', 'mumbai', 'united')),
  summary text NOT NULL CHECK (char_length(summary) BETWEEN 1 AND 500),
  stats jsonb NOT NULL CHECK (jsonb_typeof(stats) = 'array' AND jsonb_array_length(stats) = 4),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chapter_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_chapter_statistics" ON chapter_statistics;

CREATE POLICY "public_read_chapter_statistics"
  ON chapter_statistics
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON chapter_statistics TO anon, authenticated;

INSERT INTO chapter_statistics (region, summary, stats) VALUES
(
  'worldwide',
  'BNI generated $26.09 Billion in the last 12 months with 17.9 Million referrals worldwide',
  '[{"label":"Members Worldwide","value":355582,"suffix":"+"},{"label":"Chapters","value":11728,"suffix":"+"},{"label":"Countries","value":76,"suffix":"+"},{"label":"Referrals (Millions)","value":17,"suffix":".9M+"}]'::jsonb
),
(
  'india',
  'BNI India generated 55,770 Crores in the last 12 months with 49,31,926 referrals',
  '[{"label":"Members in India","value":72513,"suffix":"+"},{"label":"Chapters in India","value":1498,"suffix":"+"},{"label":"Cities","value":143,"suffix":"+"},{"label":"Business (Crores)","value":55770,"suffix":"+"}]'::jsonb
),
(
  'mumbai',
  'BNI Mumbai generated 3656 Crores in the last 12 months with 3,12,434+ referrals',
  '[{"label":"Members in Mumbai","value":5976,"suffix":"+"},{"label":"Chapters in Mumbai","value":117,"suffix":"+"},{"label":"Referrals","value":312434,"suffix":"+"},{"label":"Business (Crores)","value":3656,"suffix":"+"}]'::jsonb
),
(
  'united',
  'BNI United has generated 21,35,04,308 Crores in business till date',
  '[{"label":"Referrals","value":3224,"suffix":"+"},{"label":"1-2-1 Done","value":2224,"suffix":"+"},{"label":"Visitors","value":270,"suffix":"+"},{"label":"Active Members","value":41,"suffix":""}]'::jsonb
)
ON CONFLICT (region) DO NOTHING;
