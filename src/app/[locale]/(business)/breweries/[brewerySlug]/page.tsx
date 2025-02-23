import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import BreweryBeer from "@/app/[locale]/(business)/breweries/[brewerySlug]/_components/brewery-beer";
import BreweryCard from "@/app/[locale]/(business)/breweries/[brewerySlug]/_components/brewery-card";
import ReplacePathname from "@/app/_components/replace-pathname";
import { getBreweryBeers, getBreweryBySlug } from "@/domain/breweries";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface BreweryPageProps {
  params: Promise<{
    brewerySlug: string;
  }>;
}

const BreweryPage = async ({ params }: BreweryPageProps) => {
  const t = await getTranslations();

  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  const beers = await getBreweryBeers(brewery.id);

  return (
    <div className="flex flex-col gap-y-8 p-8">
      {brewery.slug !== brewerySlug ? (
        <ReplacePathname
          pathname={generatePath(Routes.BREWERY, {
            brewerySlug: brewery.slug,
          })}
        />
      ) : null}

      <BreweryCard name={brewery.name} country={brewery.country} />

      <div className="flex w-full flex-col gap-y-4">
        <p>{t("breweryPage.beers.count", { count: beers.length })}</p>

        <div className="flex flex-col gap-y-8">
          {beers.map((beer) => (
            <Link
              key={beer.id}
              href={generatePath(Routes.BEER, {
                brewerySlug: brewery.slug,
                beerSlug: beer.slug,
              })}
            >
              <BreweryBeer
                name={beer.name}
                style={beer.style}
                abv={beer.abv}
                ibu={beer.ibu ?? undefined}
                color={{
                  name: beer.color.name,
                  hex: beer.color.hex,
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreweryPage;
