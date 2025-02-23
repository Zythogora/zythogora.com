BEGIN;

-- DropIndex
DROP INDEX "beer_data"."beers_slug_key";

-- DropIndex
DROP INDEX "beer_data"."breweries_slug_key";

-- AlterTable
ALTER TABLE "beer_data"."beers" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "beer_data"."breweries" DROP COLUMN "slug";

COMMIT;
