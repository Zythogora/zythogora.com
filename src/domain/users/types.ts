import type {
  Acidity,
  AromasIntensity,
  Beers,
  Bitterness,
  BodyStrength,
  Breweries,
  CarbonationIntensity,
  Colors,
  Duration,
  FlavorsIntensity,
  FriendRequests,
  Haziness,
  HeadRetention,
  LabelDesign,
  Reviews,
  ServingFrom,
  Styles,
  Users,
} from "@db/client";

import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";

export type RawUser = Users & {
  _count: { reviews: number };
  unique_beers: bigint;
  unique_breweries: bigint;
  unique_styles: bigint;
  unique_countries: bigint;
};

export type User = {
  id: string;
  username: string;
  reviewCount: number;
  uniqueBeerCount: number;
  uniqueBreweryCount: number;
  uniqueStyleCount: number;
  uniqueCountryCount: number;
};

export type RawUserReview = Reviews & {
  beer: Beers & {
    brewery: Breweries;
    color: Colors;
  };
};

export type UserReview = {
  id: string;
  slug: string;
  globalScore: number;
  beer: {
    id: string;
    name: string;
    brewery: {
      id: string;
      name: string;
      country: Country;
    };
    color: Color;
  };
  createdAt: Date;
};

export type RawReview = Reviews & {
  user: Users;
  beer: Beers & {
    brewery: Breweries;
    style: Styles;
  };
};

export type Review = {
  id: string;
  slug: string;
  globalScore: number;
  servingFrom: ServingFrom;
  bestBeforeDate?: Date;
  comment?: string;
  pictureUrl?: string;
  labelDesign?: LabelDesign;
  haziness?: Haziness;
  headRetention?: HeadRetention;
  aromasIntensity?: AromasIntensity;
  flavorsIntensity?: FlavorsIntensity;
  bodyStrength?: BodyStrength;
  carbonationIntensity?: CarbonationIntensity;
  bitterness?: Bitterness;
  acidity?: Acidity;
  duration?: Duration;
  user: {
    username: string;
  };
  beer: {
    id: string;
    slug: string;
    name: string;
    abv: number;
    ibu?: number;
    style: string;
    brewery: {
      id: string;
      slug: string;
      name: string;
    };
  };
  createdAt: Date;
  hasAppearance: boolean;
  hasNose: boolean;
  hasTaste: boolean;
  hasFinish: boolean;
};

export type FriendshipStatus =
  | "FRIENDS"
  | "PENDING_APPROVAL"
  | "REQUEST_RECEIVED"
  | "REQUEST_REJECTED"
  | "NOT_FRIENDS";

export type RawFriendRequest = FriendRequests & {
  requester: Users;
};

export type FriendRequest = {
  status: "ACCEPTED" | "ALREADY_FRIENDS";
  friend: {
    username: string;
  };
};
