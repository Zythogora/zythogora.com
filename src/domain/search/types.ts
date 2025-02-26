import type { Country } from "@/lib/i18n/countries/types";

export type BeerResult = {
  id: string;
  slug: string;
  name: string;
  brewery: {
    slug: string;
    name: string;
    country: Country;
  };
  style: string;
  abv: number;
  ibu?: number;
  color: {
    name: string;
    hex: string;
  };
};

export type BreweryResult = {
  id: string;
  slug: string;
  name: string;
  country: Country;
  beerCount: number;
};
