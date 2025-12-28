BEGIN;

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "price_currency",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(7,2);

COMMIT;
