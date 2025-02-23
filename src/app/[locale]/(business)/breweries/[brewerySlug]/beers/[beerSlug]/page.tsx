import { notFound } from "next/navigation";

import BeerCard from "@/app/[locale]/(business)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-card";
import ReplacePathname from "@/app/_components/replace-pathname";
import { getBeerBySlug } from "@/domain/beers";
import { publicConfig } from "@/lib/config/client-config";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

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
  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  return (
    <div className="flex flex-col gap-y-8 p-8">
      {beer.brewery.slug !== brewerySlug || beer.slug !== beerSlug ? (
        <ReplacePathname
          pathname={generatePath(Routes.BEER, {
            brewerySlug: beer.brewery.slug,
            beerSlug: beer.slug,
          })}
        />
      ) : null}

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
