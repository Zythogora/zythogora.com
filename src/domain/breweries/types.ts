import type {
  Beers,
  Breweries,
  Colors,
  Reviews,
  Styles,
  Users,
} from "@db/client";

import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";

export type RawBrewery = Breweries & {
  beers: RawBreweryBeer[];
};

export type Brewery = {
  id: string;
  slug: string;
  name: string;
  location: {
    country: Country;
    state?: string;
    city?: string;
    address?: string;
  };
  creationYear?: number;
  description?: string;
  websiteLink?: string;
  socialLinks?: {
    name: string;
    url: string;
  }[];
  contactEmail?: string;
  contactPhoneNumber?: string;
  beers: BreweryBeer[];
};

export type RawBreweryBeer = Beers & {
  style: Styles;
  color: Colors;
};

export type BreweryBeer = {
  id: string;
  slug: string;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  color: Color;
};

export type RawBreweryReview = Reviews & {
  beer: Beers & {
    style: Styles;
    color: Colors;
  };
  user: Users;
};

export type BreweryReview = {
  id: string;
  slug: string;
  globalScore: number;
  beer: {
    id: string;
    name: string;
    style: string;
    abv: number;
    ibu?: number;
    color: Color;
  };
  user: {
    username: string;
  };
  createdAt: Date;
};
