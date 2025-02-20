import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerTab from "@/app/[locale]/(business)/(search)/search/_components/tab/beer";
import BreweryTab from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery";
import { searchParamsSchema } from "@/app/[locale]/(business)/(search)/search/schemas";
import Await from "@/app/_components/await";
import { searchBeers, searchBreweries } from "@/domain/search";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface SearchPageProps {
  searchParams: Promise<{
    kind?: string;
    search?: string;
    page?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const searchParamsResult = searchParamsSchema.safeParse(await searchParams);

  if (!searchParamsResult.success) {
    console.error(searchParamsResult.error);
    return redirect({
      href: Routes.SEARCH,
      locale,
    });
  }

  const { search, kind, limit, page } = searchParamsResult.data;

  if (kind === "beers") {
    if (!search) {
      return <p>{t("searchPage.beers.noSearch")}</p>;
    }

    return (
      <Suspense fallback={<p>{t("searchPage.beers.searching", { search })}</p>}>
        <Await promise={searchBeers({ search, limit, page })}>
          {({ results, count, page }) => (
            <BeerTab results={results} count={count} page={page} />
          )}
        </Await>
      </Suspense>
    );
  }

  if (kind === "breweries") {
    if (!search) {
      return <p>{t("searchPage.breweries.noSearch")}</p>;
    }

    return (
      <Suspense
        fallback={<p>{t("searchPage.breweries.searching", { search })}</p>}
      >
        <Await
          promise={searchBreweries({
            search,
            limit,
            page,
          })}
        >
          {({ results, count, page }) => (
            <BreweryTab results={results} count={count} page={page} />
          )}
        </Await>
      </Suspense>
    );
  }
};

export default SearchPage;
