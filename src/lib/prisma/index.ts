import { PrismaClient } from "@prisma/client";

import type { PrismaTransactionClient } from "@/lib/prisma/types";

const prisma = new PrismaClient();

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
