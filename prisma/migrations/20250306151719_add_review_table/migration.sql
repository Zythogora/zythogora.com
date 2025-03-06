BEGIN;

-- CreateEnum
CREATE TYPE "public"."serving_from" AS ENUM ('DRAFT', 'BOTTLE', 'CAN', 'GROWLER', 'CASK');

-- CreateEnum
CREATE TYPE "public"."label_design" AS ENUM ('HATE_IT', 'MEH', 'AVERAGE', 'GOOD', 'LOVE_IT');

-- CreateEnum
CREATE TYPE "public"."haziness" AS ENUM ('COMPLETELY_CLEAR', 'VERY_SLIGHTLY_CAST', 'SLIGHTLY_HAZY', 'HAZY', 'VERY_HAZY');

-- CreateEnum
CREATE TYPE "public"."head_retention" AS ENUM ('POOR', 'SHORT_LIVED', 'MODERATE', 'GOOD', 'EXCELLENT');

-- CreateEnum
CREATE TYPE "public"."aromas_intensity" AS ENUM ('FAINT', 'MILD', 'MODERATE', 'PRONOUNCED', 'INTENSE');

-- CreateEnum
CREATE TYPE "public"."flavors_intensity" AS ENUM ('FAINT', 'MILD', 'MODERATE', 'PRONOUNCED', 'INTENSE');

-- CreateEnum
CREATE TYPE "public"."body_strength" AS ENUM ('THIN', 'LIGHT', 'MEDIUM', 'FULL', 'HEAVY');

-- CreateEnum
CREATE TYPE "public"."carbonation_intensity" AS ENUM ('FLAT', 'LOW', 'MODERATE', 'LIVELY', 'HIGHLY_CARBONATED');

-- CreateEnum
CREATE TYPE "public"."bitterness" AS ENUM ('LOW', 'MODERATE', 'PRONOUNCED', 'AGGRESSIVE', 'LINGERING');

-- CreateEnum
CREATE TYPE "public"."acidity" AS ENUM ('NONE', 'SOFT', 'BRIGHT', 'TART', 'PUCKERING');

-- CreateEnum
CREATE TYPE "public"."duration" AS ENUM ('SHORT', 'MODERATE', 'MEDIUM', 'LONG', 'ENDLESS');

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "global_score" DECIMAL(3,1) NOT NULL,
    "serving_from" "public"."serving_from" NOT NULL,
    "comment" TEXT,
    "label_design" "public"."label_design",
    "haziness" "public"."haziness",
    "head_retention" "public"."head_retention",
    "aromas_intensity" "public"."aromas_intensity",
    "flavors_intensity" "public"."flavors_intensity",
    "body_strength" "public"."body_strength",
    "carbonation_intensity" "public"."carbonation_intensity",
    "bitterness" "public"."bitterness",
    "acidity" "public"."acidity",
    "duration" "public"."duration",
    "beer_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_beer_id_fkey" FOREIGN KEY ("beer_id") REFERENCES "beer_data"."beers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
