import countries from "i18n-iso-countries";
import { getLocale } from "next-intl/server";

import { routing } from "@/lib/i18n";
import { UnknownCountryCodeError } from "@/lib/i18n/countries/errors";
import type { Country } from "@/lib/i18n/countries/types";

for (const locale of routing.locales) {
  countries.registerLocale(
    (await import(`i18n-iso-countries/langs/${locale}.json`)).default,
  );
}

export const countryCodes = Object.keys(
  countries.getNames(routing.defaultLocale),
).sort();

export const getCountry = async (code: string): Promise<Country> => {
  const locale = await getLocale();

  const name = countries.getName(code, locale);

  if (name === undefined) {
    throw new UnknownCountryCodeError(code);
  }

  return { code, name };
};

export default countries;
