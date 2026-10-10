/*
# Updated Public Chapter Statistics

Expands the regional statistic groups to the requested number of cards and
updates the published figures shown on the homepage.
*/

BEGIN;

ALTER TABLE chapter_statistics
  DROP CONSTRAINT IF EXISTS chapter_statistics_stats_check;

ALTER TABLE chapter_statistics
  ADD CONSTRAINT chapter_statistics_stats_check CHECK (
    jsonb_typeof(stats) = 'array'
    AND (
      (region = 'worldwide' AND jsonb_array_length(stats) = 5)
      OR (region = 'india' AND jsonb_array_length(stats) = 6)
      OR (region = 'mumbai' AND jsonb_array_length(stats) = 5)
      OR (region = 'united' AND jsonb_array_length(stats) = 4)
    )
  );

INSERT INTO chapter_statistics (region, summary, stats) VALUES
(
  'worldwide',
  'BNI global statistics for September 2025 through August 2026',
  '[{"label":"Members","value":359812,"suffix":""},{"label":"Chapters","value":11894,"suffix":""},{"label":"Countries","value":76,"suffix":""},{"label":"Referrals (Sep 25 – Aug 26)","value":17,"suffix":".25 Million"},{"label":"Business Generated (Sep 25 – Aug 26)","value":26,"suffix":".9 Billion USD"}]'::jsonb
),
(
  'india',
  'BNI India performance in the last 12 months',
  '[{"label":"Members","value":76543,"suffix":""},{"label":"Chapters","value":1577,"suffix":""},{"label":"Cities","value":149,"suffix":""},{"label":"Referrals Passed","value":4990438,"suffix":""},{"label":"Business Done in the Last 12 Months","value":60503,"suffix":" Crores"},{"label":"Average Value of the Seat Per Annum","value":83,"suffix":".62 Lakh"}]'::jsonb
),
(
  'mumbai',
  'BNI Mumbai performance in the last 12 months',
  '[{"label":"Members","value":5973,"suffix":""},{"label":"Chapters","value":117,"suffix":""},{"label":"Referrals Passed","value":307050,"suffix":""},{"label":"Business Done in the Last 12 Months","value":3775,"suffix":" Crores"},{"label":"Average Value of the Seat Per Annum","value":63,"suffix":".34 Lakh"}]'::jsonb
)
ON CONFLICT (region) DO UPDATE SET
  summary = EXCLUDED.summary,
  stats = EXCLUDED.stats,
  updated_at = now();

COMMIT;
