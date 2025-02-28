import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BreweryBeer from "@/app/[locale]/(business)/(app-with-header)/breweries/[brewerySlug]/_components/brewery-beer";
import BreweryBeerListLoader from "@/app/[locale]/(business)/(app-with-header)/breweries/[brewerySlug]/_components/brewery-beer-list/loader";
import Await from "@/app/_components/await";
import { getBreweryBeers } from "@/domain/breweries";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface BreweryBeerListProps {
  breweryId: string;
  brewerySlug: string;
}

const BreweryBeerList = async ({
  breweryId,
  brewerySlug,
}: BreweryBeerListProps) => {
  const t = await getTranslations();

  const breweryBeersPromise = getBreweryBeers(breweryId);

  return (
    <Suspense fallback={<BreweryBeerListLoader />}>
      <Await promise={breweryBeersPromise}>
        {(beers) => (
          <div className="flex w-full flex-col gap-y-4">
            <p>{t("breweryPage.beers.count", { count: beers.length })}</p>

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
                    color={{
                      name: beer.color.name,
                      hex: beer.color.hex,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default BreweryBeerList;
