BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."breweries" ADD COLUMN     "creation_year" INTEGER;

COMMIT;
