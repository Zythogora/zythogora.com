BEGIN;

-- AlterTable
ALTER TABLE "public"."purchase_locations" 
  ADD COLUMN "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "created_by" TEXT,
  ADD COLUMN "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_by" TEXT;

UPDATE "public"."purchase_locations"
SET 
  "created_at" = CURRENT_TIMESTAMP,
  "created_by" = (SELECT "id" FROM "public"."users" LIMIT 1),
  "updated_at" = CURRENT_TIMESTAMP,
  "updated_by" = (SELECT "id" FROM "public"."users" LIMIT 1)
WHERE "created_by" IS NULL;

-- AlterTable
ALTER TABLE "public"."purchase_locations"
  ALTER COLUMN "created_at" SET NOT NULL,
  ALTER COLUMN "created_by" SET NOT NULL,
  ALTER COLUMN "updated_at" SET NOT NULL,
  ALTER COLUMN "updated_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."purchase_locations"
  ADD CONSTRAINT "purchase_locations_created_by_fkey" 
    FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "purchase_locations_updated_by_fkey" 
    FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;

