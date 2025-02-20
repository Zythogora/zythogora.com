import { getTranslations } from "next-intl/server";

import BrewerySearchResult from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery/result";
import { getCountryName } from "@/lib/i18n/countries";

import type { BreweryResult } from "@/domain/search/types";

interface BreweryTabProps {
  results: BreweryResult[];
}

const BreweryTab = async ({ results }: BreweryTabProps) => {
  const t = await getTranslations();

  if (results.length === 0) {
    return <p>{t("searchPage.breweries.noResults")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("searchPage.breweries.results", { count: results.length })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {Promise.all(
          results.map(async (brewery) => (
            <BrewerySearchResult
              key={brewery.id}
              name={brewery.name}
              location={{
                country: {
                  name: await getCountryName(brewery.countryCode),
                  code: brewery.countryCode,
                },
              }}
              beerCount={brewery.beerCount}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default BreweryTab;
