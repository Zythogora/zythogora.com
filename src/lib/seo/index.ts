import { publicConfig } from "@/lib/config/client-config";
import { routing } from "@/lib/i18n";

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

export const getAlternates = (path: string, locale?: string) => {
  const defaultLocalePath = getAbsoluteUrl(path);
  const canonicalPath =
    locale && locale !== routing.defaultLocale
      ? getAbsoluteUrl(`/${locale}${path}`)
      : defaultLocalePath;

  return {
    canonical: canonicalPath,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? defaultLocalePath
            : getAbsoluteUrl(`/${l}${path}`),
        ]),
      ),
      "x-default": defaultLocalePath,
    },
  };
};
