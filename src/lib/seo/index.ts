import { publicConfig } from "@/lib/config/client-config";
import { routing } from "@/lib/i18n";

import type { BreadcrumbList, WithContext } from "schema-dts";

export const URLS_PER_SITEMAP = 50000;

export const getAbsoluteUrl = (path: string) => {
  const baseUrl = publicConfig.baseUrl.replace(/\/+$/, "");

  if (path === "" || path === "/") {
    return baseUrl;
  }

  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }

  return `${baseUrl}/${path}`;
};

export const getBreadcrumbListJsonLd = (
  items: Array<{ name: string; path: string }>,
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: getAbsoluteUrl(item.path),
  })),
});

export const getAlternates = (path: string, locale?: string) => {
  const normalizedPath = path === "/" ? "" : path;

  const defaultLocalePath = getAbsoluteUrl(normalizedPath);
  const canonicalPath =
    locale && locale !== routing.defaultLocale
      ? getAbsoluteUrl(`/${locale}${normalizedPath}`)
      : defaultLocalePath;

  return {
    canonical: canonicalPath,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? defaultLocalePath
            : getAbsoluteUrl(`/${l}${normalizedPath}`),
        ]),
      ),
      "x-default": defaultLocalePath,
    },
  };
};
