import { getTranslations } from "next-intl/server";

import BrewerySearchResult from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery/result";
import Pagination from "@/app/_components/ui/pagination";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

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
    return <p>{t("searchPage.brewery.noResult")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("searchPage.brewery.results", { count })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {results.map((brewery) => (
          <Link
            key={brewery.id}
            href={generatePath(Routes.BREWERY, {
              brewerySlug: brewery.slug,
            })}
          >
            <BrewerySearchResult
              key={brewery.id}
              name={brewery.name}
              location={{ country: brewery.country }}
              beerCount={brewery.beerCount}
            />
          </Link>
        ))}

        <Pagination current={page.current} total={page.total} />
      </div>
    </div>
  );
};

export default BreweryTab;
