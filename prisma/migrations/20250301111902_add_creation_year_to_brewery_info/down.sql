BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."breweries" DROP COLUMN "creation_year";

COMMIT;
