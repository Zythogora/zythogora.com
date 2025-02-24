import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import BeerCard from "@/app/[locale]/(business)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-card";
import { getBeerBySlug } from "@/domain/beers";
import { publicConfig } from "@/lib/config/client-config";
import { redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export async function generateStaticParams() {
  const beers = await prisma.beers.findMany({
    include: { brewery: true },
  });

  return beers
    .map((beer) => [
      {
        brewerySlug: beer.brewery.slug.slice(0, 4),
        beerSlug: beer.slug.slice(0, 4),
      },
      {
        brewerySlug: beer.brewery.slug,
        beerSlug: beer.slug,
      },
    ])
    .flat();
}

interface BeerPageProps {
  params: Promise<{
    brewerySlug: string;
    beerSlug: string;
  }>;
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
    <div className="flex flex-col gap-y-8 p-8">
      <BeerCard
        name={beer.name}
        brewery={beer.brewery}
        abv={beer.abv}
        ibu={beer.ibu}
        style={beer.style}
        color={beer.color}
      />
    </div>
  );
};

export default BeerPage;
