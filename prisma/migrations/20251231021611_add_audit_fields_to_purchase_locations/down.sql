BEGIN;

-- AlterTable
ALTER TABLE "public"."purchase_locations"
  DROP CONSTRAINT IF EXISTS "purchase_locations_updated_by_fkey",
  DROP CONSTRAINT IF EXISTS "purchase_locations_created_by_fkey";

-- AlterTable
ALTER TABLE "public"."purchase_locations"
  DROP COLUMN "updated_by",
  DROP COLUMN "updated_at",
  DROP COLUMN "created_by",
  DROP COLUMN "created_at";

COMMIT;

