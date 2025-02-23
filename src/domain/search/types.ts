export type BeerResult = {
  id: string;
  slug: string;
  name: string;
  brewery: {
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

export type BreweryResult = {
  id: string;
  slug: string;
  name: string;
  country: {
    name: string;
    code: string;
  };
  beerCount: number;
};
