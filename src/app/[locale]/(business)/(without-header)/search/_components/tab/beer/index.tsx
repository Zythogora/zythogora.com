import { getTranslations } from "next-intl/server";

import BeerSearchResult from "@/app/[locale]/(business)/(without-header)/search/_components/tab/beer/result";
import Pagination from "@/app/_components/ui/pagination";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

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
    return (
      <>
        <p>{t("searchPage.beer.noResult")}</p>

        <Link
          href={generatePath(Routes.CREATE_BEER)}
          className={cn("underline", "text-primary-700 dark:text-primary")}
        >
          {t("searchPage.beer.createNoResult")}
        </Link>
      </>
    );
  }

  return (
    <>
      <p>{t("searchPage.beer.results", { count })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {results.map((beer) => (
          <Link
            key={beer.id}
            href={generatePath(Routes.BEER, {
              brewerySlug: beer.brewery.slug,
              beerSlug: beer.slug,
            })}
            prefetch={true}
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

        <Link
          href={generatePath(Routes.CREATE_BEER)}
          className={cn(
            "mx-auto underline",
            "text-primary-700 dark:text-primary",
          )}
        >
          {t("searchPage.beer.create")}
        </Link>
      </div>
    </>
  );
};

export default BeerTab;
