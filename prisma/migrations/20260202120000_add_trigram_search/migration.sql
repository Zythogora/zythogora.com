BEGIN;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create immutable unaccent wrapper (required for indexing)
CREATE OR REPLACE FUNCTION f_unaccent(text)
RETURNS text AS $$
  SELECT public.unaccent('public.unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- Beer name index (for trigram search)
CREATE INDEX idx_beers_name_trgm
ON beer_data.beers
USING GIN (f_unaccent(lower(name)) gin_trgm_ops);

-- Brewery name index (for trigram search)
CREATE INDEX idx_breweries_name_trgm
ON beer_data.breweries
USING GIN (f_unaccent(lower(name)) gin_trgm_ops);

-- User username index (for trigram search)
CREATE INDEX idx_users_username_trgm
ON public.users
USING GIN (f_unaccent(lower(username)) gin_trgm_ops);

COMMIT;
