BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."beers" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "beer_data"."breweries" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "beers_slug_key" ON "beer_data"."beers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "breweries_slug_key" ON "beer_data"."breweries"("slug");

COMMIT;
