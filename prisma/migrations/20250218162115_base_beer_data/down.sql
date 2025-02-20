BEGIN;

-- DropIndex
DROP INDEX "beer_data"."beers_name_brewery_id_key";

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_brewery_id_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_style_id_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_color_id_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_created_by_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."beers" DROP CONSTRAINT "beers_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."breweries" DROP CONSTRAINT "breweries_created_by_fkey";

-- DropForeignKey
ALTER TABLE "beer_data"."breweries" DROP CONSTRAINT "breweries_updated_by_fkey";

-- DropTable
DROP TABLE "beer_data"."beers";

-- DropTable
DROP TABLE "beer_data"."breweries";

-- DropTable
DROP TABLE "beer_data"."styles";

-- DropTable
DROP TABLE "beer_data"."colors";

COMMIT;
