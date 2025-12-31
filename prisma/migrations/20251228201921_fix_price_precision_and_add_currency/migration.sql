BEGIN;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "price_currency" CHAR(3),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_price_currency_required_when_price" 
  CHECK ((price IS NULL AND price_currency IS NULL) OR (price IS NOT NULL AND price_currency IS NOT NULL));

COMMIT;
