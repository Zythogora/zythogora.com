import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@db/client";

import { config } from "@/lib/config";
import type { PrismaTransactionClient } from "@/lib/prisma/types";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: config.database.url }),
});

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
