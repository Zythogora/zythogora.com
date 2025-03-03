BEGIN;

-- DropIndex
DROP INDEX "beer_data"."style_categories_name_key";

-- DropIndex
DROP INDEX "beer_data"."styles_name_key";

-- DropForeignKey
ALTER TABLE "beer_data"."styles" DROP CONSTRAINT "styles_category_id_fkey";

-- DropTable
DROP TABLE "beer_data"."style_categories";

-- DropTable
DROP TABLE "beer_data"."styles";

COMMIT;
