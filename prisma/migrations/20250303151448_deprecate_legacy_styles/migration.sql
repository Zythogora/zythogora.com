BEGIN;

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_style_id_fkey";

-- AlterTable
ALTER TABLE "beer_data"."styles" RENAME TO "legacy_styles";

-- AlterTable
ALTER TABLE "beer_data"."legacy_styles" RENAME CONSTRAINT "styles_pkey" TO "legacy_styles_pkey";

-- AddForeignKey
ALTER TABLE "beer_data"."beers" ADD CONSTRAINT "beers_legacy_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "beer_data"."legacy_styles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
