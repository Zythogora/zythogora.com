"server only";

import { getCountry } from "@/lib/i18n/countries";

import type {
  Brewery,
  BreweryBeer,
  RawBreweryBeer,
} from "@/domain/breweries/types";
import type { RawBrewery } from "@/domain/breweries/types";

export const transformRawBreweryToBrewery = async (
  rawBrewery: RawBrewery,
): Promise<Brewery> => ({
  id: rawBrewery.id,
  slug: rawBrewery.slug,
  name: rawBrewery.name,
  country: await getCountry(rawBrewery.countryAlpha2Code),
  beers: rawBrewery.beers.map(transformRawBreweryBeerToBreweryBeer),
});

export const transformRawBreweryBeerToBreweryBeer = (
  rawBeer: RawBreweryBeer,
): BreweryBeer => ({
  id: rawBeer.id,
  slug: rawBeer.slug,
  name: rawBeer.name,
  style: rawBeer.style.name,
  abv: rawBeer.abv,
  ibu: rawBeer.ibu ?? undefined,
  color: {
    name: rawBeer.color.name,
    hex: rawBeer.color.hex,
  },
});
