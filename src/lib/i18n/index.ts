import { createTranslator } from "next-intl";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";

import type { Locale } from "@/lib/i18n/types";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});

export const getTranslationsByLocale = async (locale: Locale) => {
  const messages = (await import(`./translations/${locale}.json`)).default;
  return createTranslator({ locale, messages });
};
