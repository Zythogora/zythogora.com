"use client";

import { useLocale } from "next-intl";

import countries from "@/lib/i18n/countries";
import { UnknownCountryCodeError } from "@/lib/i18n/countries/errors";

import type { Country } from "@/lib/i18n/countries/types";

export const useCountryCode = () => {
  const locale = useLocale();

  return {
    getCountry: (code: string): Country => {
      const name = countries.getName(code, locale);

      if (name === undefined) {
        throw new UnknownCountryCodeError(code);
      }

      return { code, name: name };
    },
  };
};
