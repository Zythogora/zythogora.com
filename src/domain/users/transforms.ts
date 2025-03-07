import { transformRawColorToColor } from "@/domain/beers/transforms";
import { getCountry } from "@/lib/i18n/countries";

import type {
  RawUserReview,
  RawUser,
  UserReview,
  User,
} from "@/domain/users/types";

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

export const transformRawUserReviewToUserReview = async (
  rawUserReview: RawUserReview,
): Promise<UserReview> => {
  return {
    id: rawUserReview.id,
    globalScore: rawUserReview.globalScore.toNumber(),
    beer: {
      id: rawUserReview.beer.id,
      name: rawUserReview.beer.name,
      brewery: {
        id: rawUserReview.beer.brewery.id,
        name: rawUserReview.beer.brewery.name,
        country: await getCountry(rawUserReview.beer.brewery.countryAlpha2Code),
      },
      color: transformRawColorToColor(rawUserReview.beer.color),
    },
    createdAt: rawUserReview.createdAt,
  };
};
