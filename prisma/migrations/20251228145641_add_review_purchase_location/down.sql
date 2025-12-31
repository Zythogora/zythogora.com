BEGIN;

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_purchase_location_id_fkey";

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "purchase_location_id";

-- DropTable
DROP TABLE "public"."purchase_locations";

-- DropEnum
DROP TYPE "public"."purchase_type";

COMMIT;
