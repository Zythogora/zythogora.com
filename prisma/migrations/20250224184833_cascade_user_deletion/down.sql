BEGIN;

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "authentication"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
