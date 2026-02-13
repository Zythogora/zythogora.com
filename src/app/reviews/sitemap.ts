import { publicConfig } from "@/lib/config/client-config";
import prisma from "@/lib/prisma";
import { getAlternates, URLS_PER_SITEMAP } from "@/lib/seo";

import type { MetadataRoute } from "next";

export const generateSitemaps = async () => {
  const count = await prisma.reviews.count();
  const numberOfSitemaps = Math.max(1, Math.ceil(count / URLS_PER_SITEMAP));

  return Array.from({ length: numberOfSitemaps }, (_, i) => ({ id: i }));
};

const sitemap = async ({ id = 0 }): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = publicConfig.baseUrl;

  const skip = Number(id) * URLS_PER_SITEMAP;

  const reviews = await prisma.reviews.findMany({
    select: {
      slug: true,
      pictureUrl: true,
      updatedAt: true,
      user: { select: { username: true } },
    },
    orderBy: { id: "asc" },
    ...(skip > 0 && { skip }),
    take: URLS_PER_SITEMAP,
  });

  return reviews.map((review) => {
    const path = `/users/${review.user.username}/reviews/${review.slug}`;

    return {
      url: `${baseUrl}${path}`,
      lastModified: review.updatedAt,
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: getAlternates(path),
      ...(review.pictureUrl ? { images: [review.pictureUrl] } : {}),
    };
  });
};

export default sitemap;
