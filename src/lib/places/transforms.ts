import type {
  AutocompleteLocation,
  PlaceAddressDetails,
} from "@/lib/places/types";

import type { google } from "@googlemaps/places/build/protos/protos";

export const transformAutocompletePlacesSuggestionToAutocompleteLocation = (
  rawAutocompleteLocation: google.maps.places.v1.AutocompletePlacesResponse.ISuggestion,
): AutocompleteLocation | undefined => {
  if (!rawAutocompleteLocation.placePrediction?.placeId) {
    return undefined;
  }

  return {
    placeId: rawAutocompleteLocation.placePrediction.placeId,
    mainText:
      rawAutocompleteLocation.placePrediction.structuredFormat?.mainText
        ?.text ?? "",
    secondaryText:
      rawAutocompleteLocation.placePrediction.structuredFormat?.secondaryText
        ?.text ?? "",
  };
};

export const transformAddressComponentsToPlaceAddressDetails = (
  addressComponents: google.maps.places.v1.Place.IAddressComponent[],
  shortFormattedAddress: string | null,
): PlaceAddressDetails => {
  const findComponent = (type: string) =>
    addressComponents.find((c) => c.types?.includes(type));

  const country = findComponent("country");
  const state = findComponent("administrative_area_level_1");
  const city = findComponent("locality") ?? findComponent("postal_town");
  const streetNumber = findComponent("street_number");
  const route = findComponent("route");

  let address: string | null = null;
  if (streetNumber?.longText && route?.longText) {
    address = `${streetNumber.longText} ${route.longText}`;
  } else if (route?.longText) {
    address = route.longText;
  } else if (shortFormattedAddress) {
    address = shortFormattedAddress;
  }

  return {
    country: country?.shortText ?? "",
    state: state?.longText ?? null,
    city: city?.longText ?? null,
    address,
  };
};
