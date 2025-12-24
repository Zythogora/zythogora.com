"use client";

import { useLocale } from "next-intl";

import countries from "@/lib/i18n/countries";
import { UnknownCountryCodeError } from "@/lib/i18n/countries/errors";
import type { Country } from "@/lib/i18n/countries/types";

export const useCountryCode = () => {
  const locale = useLocale();

  return {
    getCountry: (code: string): Country => {
      // Kosovo is represented as XKX in the ISO 3166-1 alpha-3 standard but
      // the library uses XKK which is the Unicode version of it.
      // https://github.com/michaelwittig/node-i18n-iso-countries/pull/365
      const name = countries.getName(code === "XKX" ? "XKK" : code, locale);

      if (name === undefined) {
        throw new UnknownCountryCodeError(code);
      }

      return { code, name: name };
    },
  };
};
