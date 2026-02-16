import { getAbsoluteUrl, getAlternates } from "@/lib/seo";

import type { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: getAbsoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: getAlternates("/"),
    },
    {
      url: getAbsoluteUrl("/search"),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: getAlternates("/search"),
    },
  ];
};

export default sitemap;
