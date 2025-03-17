import { getTranslations } from "next-intl/server";

import BreweryBeer from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-beer";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { BreweryBeer as BreweryBeerType } from "@/domain/breweries/types";

interface BreweryBeerListProps {
  brewerySlug: string;
  beers: BreweryBeerType[];
}

const BreweryBeerList = async ({
  brewerySlug,
  beers,
}: BreweryBeerListProps) => {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-y-4">
      <p>
        {t("breweryPage.tabs.beers.content.count", {
          count: beers.length,
        })}
      </p>

      <div className="flex flex-col gap-y-8">
        {beers.map((beer) => (
          <Link
            key={beer.id}
            href={generatePath(Routes.BEER, {
              brewerySlug,
              beerSlug: beer.slug,
            })}
          >
            <BreweryBeer
              name={beer.name}
              style={beer.style}
              abv={beer.abv}
              ibu={beer.ibu ?? undefined}
              color={beer.color}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BreweryBeerList;
