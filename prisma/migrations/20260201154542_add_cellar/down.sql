BEGIN;

-- DropForeignKey
ALTER TABLE "public"."storage_locations" DROP CONSTRAINT "storage_locations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cellar_items" DROP CONSTRAINT "cellar_items_purchase_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cellar_items" DROP CONSTRAINT "cellar_items_storage_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cellar_items" DROP CONSTRAINT "cellar_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cellar_items" DROP CONSTRAINT "cellar_items_beer_id_fkey";

-- DropTable
DROP TABLE "public"."storage_locations";

-- DropTable
DROP TABLE "public"."cellar_items";

COMMIT;
