export type BeerResult = {
  id: string;
  name: string;
  brewery: {
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
  name: string;
  country: {
    name: string;
    code: string;
  };
  beerCount: number;
};
