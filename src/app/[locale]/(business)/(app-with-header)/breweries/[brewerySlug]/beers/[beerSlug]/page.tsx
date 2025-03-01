import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import BeerCard from "@/app/[locale]/(business)/(app-with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-card";
import { getBeerBySlug } from "@/domain/beers";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { StaticGenerationMode } from "@/lib/config/types";
import { redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { exhaustiveCheck } from "@/lib/typescript/utils";

interface BeerPageProps {
  params: Promise<{
    brewerySlug: string;
    beerSlug: string;
  }>;
}

export async function generateStaticParams(): Promise<
  Awaited<BeerPageProps["params"]>[]
> {
  if (config.next.staticGeneration === StaticGenerationMode.NONE) {
    // There's a bug in Next.js that crashes dynamic routes when using
    // generateStaticParams and an empty array of params.
    // The workaround is to return a dummy value.
    return [{ brewerySlug: "-", beerSlug: "-" }];
  }

  const beers = await prisma.beers.findMany({
    include: { brewery: true },
  });

  const slugs = beers.map((beer) => ({
    brewerySlug: beer.brewery.slug,
    beerSlug: beer.slug,
  }));

  if (config.next.staticGeneration === StaticGenerationMode.SLUG_ONLY) {
    return slugs;
  }

  if (config.next.staticGeneration === StaticGenerationMode.ALL) {
    return slugs
      .map((slug) => [
        slug,
        {
          brewerySlug: slug.brewerySlug.slice(0, 4),
          beerSlug: slug.beerSlug.slice(0, 4),
        },
      ])
      .flat();
  }

  return exhaustiveCheck({
    value: config.next.staticGeneration,
    error: "Invalid static generation mode for the beer page params",
  });
}

export async function generateMetadata({ params }: BeerPageProps) {
  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  return {
    title: `${beer.name} - ${beer.brewery.name} | ${publicConfig.appName}`,
  };
}

const BeerPage = async ({ params }: BeerPageProps) => {
  const locale = await getLocale();

  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  if (beer.brewery.slug !== brewerySlug || beer.slug !== beerSlug) {
    redirect({
      href: generatePath(Routes.BEER, {
        brewerySlug: beer.brewery.slug,
        beerSlug: beer.slug,
      }),
      locale,
    });
  }

  return (
    <BeerCard
      name={beer.name}
      brewery={beer.brewery}
      abv={beer.abv}
      ibu={beer.ibu}
      style={beer.style}
      color={beer.color}
    />
  );
};

export default BeerPage;
