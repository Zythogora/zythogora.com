"server only";

import { sanitizeFullTextSearch } from "@/lib/prisma";
import prisma from "@/lib/prisma";

export const searchBeers = async (search: string) => {
  const sanitizedSearch = sanitizeFullTextSearch(search);

  return prisma.beers.findMany({
    where: {
      OR: [
        { name: { search: sanitizedSearch } },
        { brewery: { name: { search: sanitizedSearch } } },
      ],
    },
    include: {
      brewery: true,
      style: true,
      color: true,
    },
  });
};
