import { transformRawColorToColor } from "@/domain/beers/transforms";
import { getCountry } from "@/lib/i18n/countries";

import type { RawReview, RawUser, Review, User } from "@/domain/users/types";

export const transformRawUserToUser = (rawUser: RawUser): User => {
  return {
    id: rawUser.id,
    username: rawUser.username,
    reviewCount: rawUser._count.reviews,
    uniqueBeerCount: rawUser.unique_beers,
    uniqueBreweryCount: rawUser.unique_breweries,
    uniqueStyleCount: rawUser.unique_styles,
    uniqueCountryCount: rawUser.unique_countries,
  };
};

export const transformRawReviewToReview = async (
  rawReview: RawReview,
): Promise<Review> => {
  return {
    id: rawReview.id,
    globalScore: rawReview.globalScore.toNumber(),
    beer: {
      id: rawReview.beer.id,
      name: rawReview.beer.name,
      brewery: {
        id: rawReview.beer.brewery.id,
        name: rawReview.beer.brewery.name,
        country: await getCountry(rawReview.beer.brewery.countryAlpha2Code),
      },
      color: transformRawColorToColor(rawReview.beer.color),
    },
    createdAt: rawReview.createdAt,
  };
};
