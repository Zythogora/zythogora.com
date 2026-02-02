BEGIN;

-- Drop indexes
DROP INDEX IF EXISTS beer_data.idx_beers_name_trgm;
DROP INDEX IF EXISTS beer_data.idx_breweries_name_trgm;
DROP INDEX IF EXISTS public.idx_users_username_trgm;

-- Drop function
DROP FUNCTION IF EXISTS f_unaccent(text);

COMMIT;
