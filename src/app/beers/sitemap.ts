import { publicConfig } from "@/lib/config/client-config";
import prisma from "@/lib/prisma";
import { getAlternates, URLS_PER_SITEMAP } from "@/lib/seo";

import type { MetadataRoute } from "next";

export const generateSitemaps = async () => {
  const count = await prisma.beers.count();
  const numberOfSitemaps = Math.max(1, Math.ceil(count / URLS_PER_SITEMAP));

  return Array.from({ length: numberOfSitemaps }, (_, id) => ({ id }));
};

const sitemap = async ({ id = 0 }): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = publicConfig.baseUrl;

  const skip = Number(id) * URLS_PER_SITEMAP;

  const beers = await prisma.beers.findMany({
    select: {
      slug: true,
      updatedAt: true,
      brewery: { select: { slug: true } },
    },
    orderBy: { id: "asc" },
    ...(skip > 0 && { skip }),
    take: URLS_PER_SITEMAP,
  });

  return beers.map((beer) => {
    const path = `/breweries/${beer.brewery.slug}/beers/${beer.slug}`;

    return {
      url: `${baseUrl}${path}`,
      lastModified: beer.updatedAt,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: getAlternates(path),
    };
  });
};

export default sitemap;
