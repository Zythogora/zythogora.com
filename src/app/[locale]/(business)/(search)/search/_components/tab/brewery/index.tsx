import { getTranslations } from "next-intl/server";

import BrewerySearchResult from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery/result";
import Pagination from "@/app/_components/ui/pagination";

import type { BreweryResult } from "@/domain/search/types";

interface BreweryTabProps {
  results: BreweryResult[];
  count: number;
  page: {
    current: number;
    total: number;
  };
}

const BreweryTab = async ({ results, count, page }: BreweryTabProps) => {
  const t = await getTranslations();

  if (results.length === 0) {
    return <p>{t("searchPage.breweries.noResult")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("searchPage.breweries.results", { count })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {results.map((brewery) => (
          <BrewerySearchResult
            key={brewery.id}
            name={brewery.name}
            location={{ country: brewery.country }}
            beerCount={brewery.beerCount}
          />
        ))}

        <Pagination current={page.current} total={page.total} />
      </div>
    </div>
  );
};

export default BreweryTab;
