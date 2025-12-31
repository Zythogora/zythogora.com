BEGIN;

-- AlterTable
ALTER TABLE "public"."reviews" DROP CONSTRAINT IF EXISTS "reviews_price_currency_required_when_price";

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "price_currency";

COMMIT;
