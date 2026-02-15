import prisma from "@/lib/prisma";
import { getAbsoluteUrl, getAlternates, URLS_PER_SITEMAP } from "@/lib/seo";

import type { MetadataRoute } from "next";

export const generateSitemaps = async () => {
  const count = await prisma.breweries.count();
  const numberOfSitemaps = Math.max(1, Math.ceil(count / URLS_PER_SITEMAP));

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
};

const sitemap = async ({ id = 0 }): Promise<MetadataRoute.Sitemap> => {
  const skip = Number(id) * URLS_PER_SITEMAP;

  const breweries = await prisma.breweries.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { id: "asc" },
    ...(skip > 0 && { skip }),
    take: URLS_PER_SITEMAP,
  });

  return breweries.map((brewery) => {
    const path = `/breweries/${brewery.slug}`;

    return {
      url: getAbsoluteUrl(path),
      lastModified: brewery.updatedAt,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: getAlternates(path),
    };
  });
};

export default sitemap;
