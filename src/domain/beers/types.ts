import type { Beers, Breweries, Colors, Styles } from "@prisma/client";

export type RawBeer = Beers & {
  brewery: Breweries;
  style: Styles;
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
    country: {
      name: string;
      code: string;
    };
  };
  style: string;
  abv: number;
  ibu?: number;
  color: {
    name: string;
    hex: string;
  };
};
