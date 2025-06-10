"server only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { config } from "@/lib/config";

import type { PrismaTransactionClient } from "@/lib/prisma/types";

// We had to disable the default prisma adapter because it broke randomly.
// The description of the issue is here
// https://github.com/orgs/supabase/discussions/7538

// However, this mean we do not have `pg_bouncer` set to `true` anymore
// and might encounter scaling problems in the future :/

const adapter = new PrismaPg({ connectionString: config.database.url });
const prisma = new PrismaClient({ adapter });

export default prisma;

export const getPrismaTransactionClient = (
  transaction?: PrismaTransactionClient,
) => {
  return async <T>(
    callback: (tx: PrismaTransactionClient) => Promise<T>,
  ): Promise<T> => {
    return transaction ? callback(transaction) : prisma.$transaction(callback);
  };
};
