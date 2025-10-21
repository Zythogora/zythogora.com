BEGIN;

-- AlterTable
ALTER TABLE "public"."reviews" ADD COLUMN     "best_before_date" DATE;

COMMIT;
