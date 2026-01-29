BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."beers" ADD COLUMN     "barrel_aged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "price" DECIMAL(7,2);

COMMIT;
