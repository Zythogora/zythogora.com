BEGIN;

-- DropForeignKey
ALTER TABLE "authentication"."sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "authentication"."accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropTable
DROP TABLE "authentication"."users";

-- DropTable
DROP TABLE "authentication"."sessions";

-- DropTable
DROP TABLE "authentication"."accounts";

-- DropTable
DROP TABLE "authentication"."verifications";

COMMIT;
