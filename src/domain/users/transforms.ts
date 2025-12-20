"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
import type {
  RawUserReview,
  RawUser,
  UserReview,
  User,
  RawReview,
  Review,
  FriendRequest,
  RawFriendRequest,
} from "@/domain/users/types";
import {
  reviewHasAppearance,
  reviewHasFinish,
  reviewHasNose,
  reviewHasTaste,
} from "@/domain/users/utils";
import { getCountry } from "@/lib/i18n/countries";

const bigIntToNumber = (value: bigint, context: string): number => {
  if (value <= Number.MAX_SAFE_INTEGER && value >= Number.MIN_SAFE_INTEGER) {
    return Number(value);
  }

  console.error(
    `Value: "${value}" is out of bounds to be a Number (${context})`,
  );
  return 0;
};

export const transformRawUserToUser = (rawUser: RawUser): User => {
  return {
    id: rawUser.id,
    username: rawUser.username,
    reviewCount: rawUser._count.reviews,
    uniqueBeerCount: bigIntToNumber(
      rawUser.unique_beers,
      `${rawUser.username} unique_beers`,
    ),
    uniqueBreweryCount: bigIntToNumber(
      rawUser.unique_breweries,
      "unique_breweries",
    ),
    uniqueStyleCount: bigIntToNumber(rawUser.unique_styles, "unique_styles"),
    uniqueCountryCount: bigIntToNumber(
      rawUser.unique_countries,
      "unique_countries",
    ),
  };
};

export const transformRawUserReviewToUserReview = async (
  rawUserReview: RawUserReview,
): Promise<UserReview> => {
  return {
    id: rawUserReview.id,
    slug: rawUserReview.slug,
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

export const transformRawReviewToReview = (rawReview: RawReview): Review => {
  return {
    id: rawReview.id,
    slug: rawReview.slug,
    globalScore: rawReview.globalScore.toNumber(),
    servingFrom: rawReview.servingFrom,
    bestBeforeDate: rawReview.bestBeforeDate ?? undefined,
    comment: rawReview.comment ?? undefined,
    pictureUrl: rawReview.pictureUrl ?? undefined,
    labelDesign: rawReview.labelDesign ?? undefined,
    haziness: rawReview.haziness ?? undefined,
    headRetention: rawReview.headRetention ?? undefined,
    aromasIntensity: rawReview.aromasIntensity ?? undefined,
    flavorsIntensity: rawReview.flavorsIntensity ?? undefined,
    bodyStrength: rawReview.bodyStrength ?? undefined,
    carbonationIntensity: rawReview.carbonationIntensity ?? undefined,
    bitterness: rawReview.bitterness ?? undefined,
    acidity: rawReview.acidity ?? undefined,
    duration: rawReview.duration ?? undefined,
    user: {
      username: rawReview.user.username,
    },
    beer: {
      id: rawReview.beer.id,
      slug: rawReview.beer.slug,
      name: rawReview.beer.name,
      abv: rawReview.beer.abv,
      ibu: rawReview.beer.ibu ?? undefined,
      style: rawReview.beer.style.name,
      brewery: {
        id: rawReview.beer.brewery.id,
        slug: rawReview.beer.brewery.slug,
        name: rawReview.beer.brewery.name,
      },
    },
    createdAt: rawReview.createdAt,
    hasAppearance: reviewHasAppearance(rawReview),
    hasNose: reviewHasNose(rawReview),
    hasTaste: reviewHasTaste(rawReview),
    hasFinish: reviewHasFinish(rawReview),
  };
};

export const transformRawFriendRequestToFriendRequest = (
  rawFriendRequest: RawFriendRequest,
  status: FriendRequest["status"],
): FriendRequest => ({
  status,
  friend: {
    username: rawFriendRequest.requester.username,
  },
});
