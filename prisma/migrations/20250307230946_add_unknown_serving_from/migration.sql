BEGIN;

-- AlterEnum
ALTER TYPE "public"."serving_from" ADD VALUE 'UNKNOWN';

COMMIT;
