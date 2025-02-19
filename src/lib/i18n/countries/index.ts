import countries from "i18n-iso-countries";
import { getLocale } from "next-intl/server";

import { routing } from "@/lib/i18n";
import { UnknownCountryCodeError } from "@/lib/i18n/countries/errors";

for (const locale of routing.locales) {
  countries.registerLocale(
    (await import(`i18n-iso-countries/langs/${locale}.json`)).default,
  );
}

export const getCountryName = async (code: string): Promise<string> => {
  const locale = await getLocale();

  const countryName = countries.getName(code, locale);

  if (countryName === undefined) {
    throw new UnknownCountryCodeError(code);
  }

  return countryName;
};

export default countries;
