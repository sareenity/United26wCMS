-- Leadership Team ownership of coordinator roles is implied. Do not persist or
-- display President, Vice President, or Secretary/Treasurer as stated owners.

BEGIN;

DELETE FROM public.committee_members
WHERE LOWER(BTRIM(role)) = 'owner';

COMMIT;
