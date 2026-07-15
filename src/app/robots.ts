import { routing } from "@/lib/i18n";
import { getAbsoluteUrl } from "@/lib/seo";

import type { MetadataRoute } from "next";

// Only paths whose crawling must be prevented entirely (e.g. token-action
// URLs) belong here. Pages that must stay out of the index but are safe to
// crawl (auth, settings, create forms) use a noindex robots meta tag instead,
// which requires them to be crawlable.
const disallowedPaths = ["/friend-requests/"];

const robots = async (): Promise<MetadataRoute.Robots> => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths.flatMap((path) => [
          path,
          ...routing.locales
            .filter((locale) => locale !== routing.defaultLocale)
            .map((locale) => `/${locale}${path}`),
        ]),
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap_index.xml"),
  };
};

export default robots;
