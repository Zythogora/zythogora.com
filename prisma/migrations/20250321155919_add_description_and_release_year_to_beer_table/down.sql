BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."beers" DROP COLUMN "description",
DROP COLUMN "release_year";

COMMIT;
