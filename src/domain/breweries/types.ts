import type { Beers, Breweries, Colors, Styles } from "@prisma/client";

export type RawBrewery = Breweries;

export type Brewery = {
  id: string;
  slug: string;
  name: string;
  country: {
    name: string;
    code: string;
  };
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
  color: {
    name: string;
    hex: string;
  };
};
