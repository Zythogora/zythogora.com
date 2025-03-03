import type { Country } from "@/lib/i18n/countries/types";
import type {
  Beers,
  Breweries,
  Colors,
  LegacyStyles,
  StyleCategories,
  Styles as RawStyles,
} from "@prisma/client";

export type RawColor = Colors;

export type Color = {
  id: string;
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

export type LegacyStyle = {
  id: string;
  name: string;
};
