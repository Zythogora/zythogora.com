import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerTab from "@/app/[locale]/(business)/(without-header)/search/_components/tab/beer";
import BreweryTab from "@/app/[locale]/(business)/(without-header)/search/_components/tab/brewery";
import UserTab from "@/app/[locale]/(business)/(without-header)/search/_components/tab/user";
import { searchParamsSchema } from "@/app/[locale]/(business)/(without-header)/search/schemas";
import Await from "@/app/_components/await";
import { searchBeers, searchBreweries, searchUsers } from "@/domain/search";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const t = await getTranslations();

  const locale = await getLocale();

  const searchParamsResult = searchParamsSchema.safeParse(await searchParams);

  if (!searchParamsResult.success) {
    return redirect({
      href: Routes.SEARCH,
      locale,
    });
  }

  return {
    title: {
      beer: t("searchPage.metadata.beerTabTitle"),
      brewery: t("searchPage.metadata.breweryTabTitle"),
      user: t("searchPage.metadata.userTabTitle"),
    }[searchParamsResult.data.kind],
  };
}

const SearchPage = async ({ searchParams }: PageProps<"/[locale]/search">) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const searchParamsResult = searchParamsSchema.safeParse(await searchParams);

  if (!searchParamsResult.success) {
    return redirect({
      href: Routes.SEARCH,
      locale,
    });
  }

  const { search, kind, limit, page } = searchParamsResult.data;

  if (kind === "beer") {
    if (!search) {
      return <p>{t("searchPage.beer.noSearch")}</p>;
    }

    return (
      <Suspense
        key={`${kind}-${search}-${page}`}
        fallback={<p>{t("searchPage.beer.searching", { search })}</p>}
      >
        <Await promise={searchBeers({ search, limit, page })}>
          {({ results, count, page }) => (
            <BeerTab results={results} count={count} page={page} />
          )}
        </Await>
      </Suspense>
    );
  }

  if (kind === "brewery") {
    if (!search) {
      return <p>{t("searchPage.brewery.noSearch")}</p>;
    }

    return (
      <Suspense
        key={`${kind}-${search}-${page}`}
        fallback={<p>{t("searchPage.brewery.searching", { search })}</p>}
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

  if (kind === "user") {
    if (!search) {
      return <p>{t("searchPage.user.noSearch")}</p>;
    }

    return (
      <Suspense
        key={`${kind}-${search}-${page}`}
        fallback={<p>{t("searchPage.user.searching", { search })}</p>}
      >
        <Await
          promise={searchUsers({
            search,
            limit,
            page,
          })}
        >
          {({ results, count, page }) => (
            <UserTab results={results} count={count} page={page} />
          )}
        </Await>
      </Suspense>
    );
  }
};

export default SearchPage;
