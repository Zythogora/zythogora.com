import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export const sanitizeFullTextSearch = (search: string) =>
  search
    .replace(/(?:<->|<[0-9]+>|[&|!<>():*])/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .join(" & ");
