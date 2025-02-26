import type { Country } from "@/lib/i18n/countries/types";
import type { Beers, Breweries, Colors, Styles } from "@prisma/client";

export type RawBrewery = Breweries;

export type Brewery = {
  id: string;
  slug: string;
  name: string;
  country: Country;
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
