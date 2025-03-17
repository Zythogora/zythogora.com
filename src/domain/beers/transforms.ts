"server only";

import { getCountry } from "@/lib/i18n/countries";

import type {
  Beer,
  BeerReview,
  Color,
  RawBeer,
  RawBeerReview,
  RawColor,
  RawStyleCategory,
  StyleCategory,
} from "@/domain/beers/types";

export const transformRawColorToColor = (rawColor: RawColor): Color => ({
  id: rawColor.id,
  name: rawColor.name,
  hex: rawColor.hex,
});

export const transformRawBeerToBeer = async (
  rawBeer: RawBeer,
): Promise<Beer> => ({
  id: rawBeer.id,
  slug: rawBeer.slug,
  name: rawBeer.name,
  brewery: {
    id: rawBeer.brewery.id,
    slug: rawBeer.brewery.slug,
    name: rawBeer.brewery.name,
    country: await getCountry(rawBeer.brewery.countryAlpha2Code),
  },
  style: rawBeer.style.name,
  abv: rawBeer.abv,
  ibu: rawBeer.ibu ?? undefined,
  color: transformRawColorToColor(rawBeer.color),
});

export const transformRawStyleCategoryToStyleCategory = (
  rawStyleCategory: RawStyleCategory,
): StyleCategory => ({
  id: rawStyleCategory.id,
  name: rawStyleCategory.name,
  styles: rawStyleCategory.styles.map((style) => ({
    id: style.id,
    name: style.name,
  })),
});

export const transformRawBeerReviewToBeerReview = (
  rawBeerReview: RawBeerReview,
): BeerReview => ({
  id: rawBeerReview.id,
  slug: rawBeerReview.slug,
  globalScore: rawBeerReview.globalScore.toNumber(),
  servingFrom: rawBeerReview.servingFrom,
  username: rawBeerReview.user.username,
  createdAt: rawBeerReview.createdAt,
});
