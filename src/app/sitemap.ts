import { publicConfig } from "@/lib/config/client-config";
import { getAlternates } from "@/lib/seo";

import type { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = publicConfig.baseUrl;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: getAlternates("/"),
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: getAlternates("/search"),
    },
  ];
};

export default sitemap;
