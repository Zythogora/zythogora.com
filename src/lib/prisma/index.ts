import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export const prepareLikeSearch = (search: string) => {
  const sanitized = search.replace(/[%_]/g, "\\$&").replace(/\s+/g, " ").trim();

  return `%${sanitized}%`;
};

export const prepareFullTextSearch = (search: string) => {
  const sanitized = search
    .replace(/(?:<->|<[0-9]+>|[&|!<>():*])/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized.split(" ").join(" & ");
};
