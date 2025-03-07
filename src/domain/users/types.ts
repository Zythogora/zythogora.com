import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";
import type { Beers, Breweries, Colors, Reviews, Users } from "@prisma/client";

export type RawUser = Users & {
  _count: { reviews: number };
  unique_beers: number;
  unique_breweries: number;
  unique_styles: number;
  unique_countries: number;
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
