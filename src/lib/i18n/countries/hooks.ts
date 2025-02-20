"use client";

import { useLocale } from "next-intl";

import countries from "@/lib/i18n/countries";
import { UnknownCountryCodeError } from "@/lib/i18n/countries/errors";

export const useCountryCode = (code: string): string => {
  const locale = useLocale();

  const countryName = countries.getName(code, locale);

  if (countryName === undefined) {
    throw new UnknownCountryCodeError(code);
  }

  return countryName;
};
