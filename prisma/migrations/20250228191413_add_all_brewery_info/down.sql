BEGIN;

-- AlterTable
ALTER TABLE "beer_data"."breweries" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "contact_email",
DROP COLUMN "contact_phone_number",
DROP COLUMN "description",
DROP COLUMN "social_links",
DROP COLUMN "state",
DROP COLUMN "website_link";

COMMIT;
