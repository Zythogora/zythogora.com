BEGIN;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "price_currency" CHAR(3),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

COMMIT;
