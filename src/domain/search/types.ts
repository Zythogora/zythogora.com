export type BeerResult = {
  id: string;
  name: string;
  brewery: {
    name: string;
    countryCode: string;
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
  countryCode: string;
  beerCount: number;
};
