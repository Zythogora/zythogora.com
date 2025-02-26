import type { Country } from "@/lib/i18n/countries/types";
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
