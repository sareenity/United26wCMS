-- Keep the persisted role catalogue aligned with
-- BNI_Roles_Responsibility_Final_LT_United_Oct26-Mar27.xlsx.

BEGIN;

-- The workbook calls this role "Door Prize"; the former suffix was an
-- implementation note and must not be displayed as part of the role name.
UPDATE public.committees
SET
  name = 'Door Prize',
  coordinator_subgroup = 'Door Prize'
WHERE name = 'Door Prize (Sync with FP?)';

-- PIO/OV is not part of the Oct 2026–Mar 2027 workbook catalogue.
DELETE FROM public.committees
WHERE REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '', 'g') = 'pioov';

COMMIT;
