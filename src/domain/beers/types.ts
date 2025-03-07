import type { Country } from "@/lib/i18n/countries/types";
import type { Beers, Breweries, Colors, LegacyStyles } from "@prisma/client";

export type RawColor = Colors;

export type Color = {
  name: string;
  hex: string;
};

export type RawBeer = Beers & {
  brewery: Breweries;
  style: LegacyStyles;
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
};
