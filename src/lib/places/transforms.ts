import type { AutocompleteLocation } from "@/lib/places/types";

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
