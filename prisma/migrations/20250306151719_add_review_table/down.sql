BEGIN;

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_beer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropTable
DROP TABLE "public"."reviews";

-- DropEnum
DROP TYPE "public"."serving_from";

-- DropEnum
DROP TYPE "public"."label_design";

-- DropEnum
DROP TYPE "public"."haziness";

-- DropEnum
DROP TYPE "public"."head_retention";

-- DropEnum
DROP TYPE "public"."aromas_intensity";

-- DropEnum
DROP TYPE "public"."flavors_intensity";

-- DropEnum
DROP TYPE "public"."body_strength";

-- DropEnum
DROP TYPE "public"."carbonation_intensity";

-- DropEnum
DROP TYPE "public"."bitterness";

-- DropEnum
DROP TYPE "public"."acidity";

-- DropEnum
DROP TYPE "public"."duration";

COMMIT;
