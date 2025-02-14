BEGIN;

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_id_fkey";

-- DropTable
DROP TABLE "public"."users";

COMMIT;
