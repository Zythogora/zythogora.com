BEGIN;

-- AlterTable
ALTER TABLE "public"."reviews" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_slug_user_id_key" ON "public"."reviews"("slug", "user_id");

-- UpdateRows
UPDATE "public"."reviews"
SET "slug" = UPPER(LEFT(REGEXP_REPLACE("reviews"."id", '[^a-zA-Z0-9]', '', 'g'), 4)) || '-' || SUBSTRING("beers"."slug" FROM 6)
FROM "beer_data"."beers"
WHERE "reviews"."beer_id" = "beers"."id";

-- AlterTable
ALTER TABLE "public"."reviews" ALTER COLUMN "slug" SET NOT NULL;

COMMIT;
