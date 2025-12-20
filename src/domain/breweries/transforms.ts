"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
import type {
  Brewery,
  BreweryBeer,
  BreweryReview,
  RawBreweryBeer,
  RawBreweryReview,
} from "@/domain/breweries/types";
import type { RawBrewery } from "@/domain/breweries/types";
import { getCountry } from "@/lib/i18n/countries";

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

export const transformRawBreweryReviewToBreweryReview = (
  rawBreweryReview: RawBreweryReview,
): BreweryReview => ({
  id: rawBreweryReview.id,
  slug: rawBreweryReview.slug,
  globalScore: rawBreweryReview.globalScore.toNumber(),
  beer: {
    id: rawBreweryReview.beer.id,
    name: rawBreweryReview.beer.name,
    style: rawBreweryReview.beer.style.name,
    abv: rawBreweryReview.beer.abv,
    ibu: rawBreweryReview.beer.ibu ?? undefined,
    color: transformRawColorToColor(rawBreweryReview.beer.color),
  },
  user: {
    username: rawBreweryReview.user.username,
  },
  createdAt: rawBreweryReview.createdAt,
});
