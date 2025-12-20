import type { Prisma } from "@db/client";

type PrismaClient = Prisma.TransactionClient;

export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
