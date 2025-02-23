import type { Breweries } from "@prisma/client";

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
