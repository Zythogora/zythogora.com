BEGIN;

-- DropForeignKey
ALTER TABLE "public"."friends" DROP CONSTRAINT "friends_friendship_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."friends" DROP CONSTRAINT "friends_user_a_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."friends" DROP CONSTRAINT "friends_user_b_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."friend_requests" DROP CONSTRAINT "friend_requests_requester_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."friend_requests" DROP CONSTRAINT "friend_requests_addressee_id_fkey";

-- DropTable
DROP TABLE "public"."friendships";

-- DropTable
DROP TABLE "public"."friends";

-- DropTable
DROP TABLE "public"."friend_requests";

-- DropEnum
DROP TYPE "public"."friend_request_status";

COMMIT;
