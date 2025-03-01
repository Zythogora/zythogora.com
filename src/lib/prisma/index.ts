import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export const slugify = (id: string, name: string) =>
  [
    id
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase(),
    name
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .slice(0, 60)
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase(),
  ].join("-");

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
