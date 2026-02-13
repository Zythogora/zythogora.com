import { publicConfig } from "@/lib/config/client-config";
import prisma from "@/lib/prisma";
import { getAlternates, URLS_PER_SITEMAP } from "@/lib/seo";

import type { MetadataRoute } from "next";

export const generateSitemaps = async () => {
  const count = await prisma.users.count();
  const numberOfSitemaps = Math.max(1, Math.ceil(count / URLS_PER_SITEMAP));

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
};

const sitemap = async ({ id = 0 }): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = publicConfig.baseUrl;

  const skip = Number(id) * URLS_PER_SITEMAP;

  const users = await prisma.users.findMany({
    select: { username: true, betterAuthUser: { select: { updatedAt: true } } },
    orderBy: { id: "asc" },
    ...(skip > 0 && { skip }),
    take: URLS_PER_SITEMAP,
  });

  return users.map((user) => {
    const path = `/users/${user.username}`;

    return {
      url: `${baseUrl}${path}`,
      lastModified: user.betterAuthUser.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
      alternates: getAlternates(path),
    };
  });
};

export default sitemap;
