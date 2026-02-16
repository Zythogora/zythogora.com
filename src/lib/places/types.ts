export type AutocompleteLocation = {
  placeId: string;
  mainText: string;
  secondaryText: string;
};

export type Place = {
  id: string;
  name: string;
  address: string;
};

export type PlaceAddressDetails = {
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
};
