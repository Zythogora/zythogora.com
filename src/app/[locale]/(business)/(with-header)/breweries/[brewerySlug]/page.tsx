import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import BreweryBeerList from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-beer-list";
import BreweryCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-card";
import BreweryReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews";
import BreweryTabList from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-tab-list";
import { brewerySearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/schemas";
import { Tabs, TabContent } from "@/app/_components/ui/tabs";
import { getBreweryBySlug } from "@/domain/breweries";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { StaticGenerationMode } from "@/lib/config/types";
import { redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";
import { exhaustiveCheck } from "@/lib/typescript/utils";

import type { Metadata } from "next";

export async function generateStaticParams(): Promise<
  Array<
    Omit<
      Awaited<PageProps<"/[locale]/breweries/[brewerySlug]">["params"]>,
      "locale"
    >
  >
> {
  if (config.next.staticGeneration === StaticGenerationMode.NONE) {
    // There's a bug in Next.js that crashes dynamic routes when using
    // generateStaticParams and an empty array of params.
    // The workaround is to return a dummy value.
    return [{ brewerySlug: "-" }];
  }

  const breweries = await prisma.breweries.findMany();

  const slugs = breweries.map((brewery) => ({ brewerySlug: brewery.slug }));

  if (config.next.staticGeneration === StaticGenerationMode.SLUG_ONLY) {
    return slugs;
  }

  if (config.next.staticGeneration === StaticGenerationMode.ALL) {
    return slugs
      .map((slug) => [slug, { brewerySlug: slug.brewerySlug.slice(0, 4) }])
      .flat();
  }

  return exhaustiveCheck({
    value: config.next.staticGeneration,
    error: "Invalid static generation mode for the brewery page params",
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]">): Promise<Metadata> {
  const t = await getTranslations();

  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  const title = `${brewery.name} | ${publicConfig.appName}`;
  const description = t("breweryPage.metadata.description", {
    breweryName: brewery.name,
    countryName: brewery.location.country.name,
    beerCount: brewery.beers.length,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: publicConfig.appName,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}

const BreweryPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/breweries/[brewerySlug]">) => {
  const locale = await getLocale();

  const { brewerySlug } = await params;

  const searchParamsResult = brewerySearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return redirect({
      href: generatePath(Routes.BREWERY, { brewerySlug }),
      locale,
    });
  }

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  if (brewery.slug !== brewerySlug) {
    redirect({
      href: generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
      locale,
    });
  }

  return (
    <div className={cn("flex w-full flex-col", "gap-y-16 md:gap-y-12")}>
      <BreweryCard brewery={brewery} />

      <div className="px-10 md:px-0">
        <Tabs defaultValue={searchParamsResult.data.tab}>
          <BreweryTabList brewerySlug={brewerySlug} />

          <TabContent value="beers">
            <BreweryBeerList brewerySlug={brewerySlug} beers={brewery.beers} />
          </TabContent>

          <TabContent value="reviews">
            <BreweryReviews
              brewerySlug={brewerySlug}
              page={searchParamsResult.data.page}
            />
          </TabContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BreweryPage;
