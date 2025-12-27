BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."beers" DROP COLUMN "barrel_aged",
DROP COLUMN "organic";

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "price";

COMMIT;
