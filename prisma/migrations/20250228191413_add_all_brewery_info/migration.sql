BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."breweries" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_phone_number" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "social_links" JSONB[],
ADD COLUMN     "state" TEXT,
ADD COLUMN     "website_link" TEXT;

COMMIT;
