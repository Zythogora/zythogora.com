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

export const getAlternates = (path: string) => {
  const canonicalPath = getAbsoluteUrl(path);

  return {
    canonical: canonicalPath,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          locale === routing.defaultLocale
            ? canonicalPath
            : getAbsoluteUrl(`/${locale}${path}`),
        ]),
      ),
      "x-default": canonicalPath,
    },
  };
};
