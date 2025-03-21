BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."beers" ADD COLUMN     "description" TEXT,
ADD COLUMN     "release_year" INTEGER;

COMMIT;
