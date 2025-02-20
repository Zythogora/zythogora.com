import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerTab from "@/app/[locale]/(business)/(search)/search/_components/tab/beer";
import BeerTabLoader from "@/app/[locale]/(business)/(search)/search/_components/tab/beer/loader";
import BreweryTab from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery";
import BreweryTabLoader from "@/app/[locale]/(business)/(search)/search/_components/tab/brewery/loader";
import Await from "@/app/_components/await";
import { searchBeers, searchBreweries } from "@/domain/search";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface SearchPageProps {
  searchParams: Promise<{
    kind?: string;
    search?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const { kind, search } = await searchParams;

  if (!kind || kind === "beers") {
    if (!search) {
      return <p>{t("searchPage.beers.noSearch")}</p>;
    }

    return (
      <Suspense fallback={<BeerTabLoader search={search} />}>
        <Await promise={searchBeers(search)}>
          {(beers) => <BeerTab results={beers} />}
        </Await>
      </Suspense>
    );
  }

  if (kind === "breweries") {
    if (!search) {
      return <p>{t("searchPage.breweries.noSearch")}</p>;
    }

    return (
      <Suspense fallback={<BreweryTabLoader search={search} />}>
        <Await promise={searchBreweries(search)}>
          {(breweryResults) => <BreweryTab results={breweryResults} />}
        </Await>
      </Suspense>
    );
  }

  // Unknown kind, redirect to beer tab
  redirect({
    href: search ? `${Routes.SEARCH}?search=${search}` : Routes.SEARCH,
    locale,
  });
};

export default SearchPage;
