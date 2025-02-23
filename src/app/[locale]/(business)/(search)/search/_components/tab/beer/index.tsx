import { getTranslations } from "next-intl/server";

import BeerSearchResult from "@/app/[locale]/(business)/(search)/search/_components/tab/beer/result";
import Pagination from "@/app/_components/ui/pagination";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { BeerResult } from "@/domain/search/types";

interface BeerTabProps {
  results: BeerResult[];
  count: number;
  page: {
    current: number;
    total: number;
  };
}

const BeerTab = async ({ results, count, page }: BeerTabProps) => {
  const t = await getTranslations();

  if (results.length === 0) {
    return <p>{t("searchPage.beer.noResult")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <p>{t("searchPage.beer.results", { count })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {results.map((beer) => (
          <Link
            key={beer.id}
            href={generatePath(Routes.BEER, {
              brewerySlug: beer.brewery.slug,
              beerSlug: beer.slug,
            })}
          >
            <BeerSearchResult
              name={beer.name}
              brewery={beer.brewery}
              style={beer.style}
              abv={beer.abv}
              ibu={beer.ibu}
              color={beer.color}
            />
          </Link>
        ))}

        <Pagination current={page.current} total={page.total} />
      </div>
    </div>
  );
};

export default BeerTab;
