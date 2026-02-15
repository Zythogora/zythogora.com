import { getAbsoluteUrl } from "@/lib/seo";

import type { MetadataRoute } from "next";

const robots = async (): Promise<MetadataRoute.Robots> => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/sign-in",
          "/sign-up",
          "/password-forgotten",
          "/reset-password",
          "/create/",
          "/friend-requests/",
        ],
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap_index.xml"),
  };
};

export default robots;
