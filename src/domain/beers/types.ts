import type {
  Beers,
  Breweries,
  Colors,
  Reviews,
  ServingFrom,
  StyleCategories,
  Styles as RawStyles,
  Users,
} from "@db/client";

import type { Country } from "@/lib/i18n/countries/types";

export type RawColor = Colors;

export type Color = {
  id: string;
  name: string;
  hex: string;
};

export type RawBeer = Beers & {
  brewery: Breweries;
  style: RawStyles;
  color: Colors;
};

export type Beer = {
  id: string;
  slug: string;
  name: string;
  brewery: {
    id: string;
    slug: string;
    name: string;
    country: Country;
  };
  style: string;
  abv: number;
  ibu?: number;
  color: Color;
  organic: boolean;
  barrelAged: boolean;
  description?: string;
  releaseYear?: number;
};

export type RawStyleCategory = StyleCategories & {
  styles: RawStyles[];
};

export type StyleCategory = {
  id: string;
  name: string;
  styles: Style[];
};

export type Style = {
  id: string;
  name: string;
};

export type RawBeerReview = Reviews & {
  user: Users;
};

export type BeerReview = {
  id: string;
  slug: string;
  globalScore: number;
  servingFrom: ServingFrom;
  username: string;
  createdAt: Date;
};
