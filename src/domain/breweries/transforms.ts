"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
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
  location: {
    country: await getCountry(rawBrewery.countryAlpha2Code),
    state: rawBrewery.state ?? undefined,
    city: rawBrewery.city ?? undefined,
    address: rawBrewery.address ?? undefined,
  },
  creationYear: rawBrewery.creationYear ?? undefined,
  description: rawBrewery.description ?? undefined,
  websiteLink: rawBrewery.websiteLink ?? undefined,
  socialLinks: rawBrewery.socialLinks ?? undefined,
  contactEmail: rawBrewery.contactEmail ?? undefined,
  contactPhoneNumber: rawBrewery.contactPhoneNumber ?? undefined,
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
  color: transformRawColorToColor(rawBeer.color),
});
