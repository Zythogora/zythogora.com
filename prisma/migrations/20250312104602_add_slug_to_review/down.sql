BEGIN;

-- DropIndex
DROP INDEX "public"."reviews_slug_user_id_key";

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "slug";

COMMIT;
