import { publicConfig } from "@/lib/config/client-config";
import { routing } from "@/lib/i18n";

export const URLS_PER_SITEMAP = 50000;

export const getAlternates = (path: string) => {
  const baseUrl = publicConfig.baseUrl;
  const canonicalPath =
    path === "/" ? baseUrl : `${baseUrl}${path}`;

  return {
    canonical: canonicalPath,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          locale === routing.defaultLocale
            ? canonicalPath
            : `${baseUrl}/${locale}${path}`,
        ]),
      ),
      "x-default": canonicalPath,
    },
  };
};
