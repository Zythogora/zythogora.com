BEGIN;

-- AlterEnum
CREATE TYPE "public"."serving_from_new" AS ENUM ('DRAFT', 'BOTTLE', 'CAN', 'GROWLER', 'CASK');
ALTER TABLE "public"."reviews" ALTER COLUMN "serving_from" TYPE "public"."serving_from_new" USING ("serving_from"::text::"public"."serving_from_new");
ALTER TYPE "public"."serving_from" RENAME TO "serving_from_old";
ALTER TYPE "public"."serving_from_new" RENAME TO "serving_from";
DROP TYPE "public"."serving_from_old";

COMMIT;
