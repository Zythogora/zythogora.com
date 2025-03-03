BEGIN;

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_legacy_style_id_fkey";

-- AlterTable
ALTER TABLE "beer_data"."legacy_styles" RENAME TO "styles";

-- AlterTable
ALTER TABLE "beer_data"."legacy_styles" RENAME CONSTRAINT "legacy_styles_pkey" TO "styles_pkey";

-- AddForeignKey
ALTER TABLE "beer_data"."beers" ADD CONSTRAINT "beers_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "beer_data"."styles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
