BEGIN;

-- AlterTable
ALTER TABLE "public"."reviews" ADD COLUMN     "picture_url" TEXT;

COMMIT;
