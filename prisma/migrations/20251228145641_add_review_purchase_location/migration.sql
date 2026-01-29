BEGIN;

-- CreateEnum
CREATE TYPE "purchase_type" AS ENUM ('PHYSICAL_LOCATION', 'ONLINE');

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "purchase_location_id" TEXT;

-- CreateTable
CREATE TABLE "purchase_locations" (
    "id" TEXT NOT NULL,
    "type" "purchase_type" NOT NULL,
    "description" TEXT NOT NULL,
    "additional_information" TEXT,

    CONSTRAINT "purchase_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_purchase_location_id_fkey" FOREIGN KEY ("purchase_location_id") REFERENCES "purchase_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
