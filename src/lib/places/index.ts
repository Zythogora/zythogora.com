"server only";

import { unstable_cache } from "next/cache";

import { UnknownPlaceError } from "@/lib/places/errors";
import { placesClient } from "@/lib/places/gcp";
import { transformAutocompletePlacesSuggestionToAutocompleteLocation } from "@/lib/places/transforms";
import type { AutocompleteLocation, Place } from "@/lib/places/types";

const getAutocompleteSuggestionsUncached = async (
  input: string,
  sessionToken: string,
): Promise<AutocompleteLocation[]> => {
  const [response] = await placesClient.autocompletePlaces({
    input,
    sessionToken,
  });

  if (!response.suggestions) {
    return [];
  }

  return response.suggestions
    .map(transformAutocompletePlacesSuggestionToAutocompleteLocation)
    .filter((location) => location !== undefined);
};

const getPlaceDetailsUncached = async (
  placeId: string,
  sessionToken: string,
): Promise<Place> => {
  const [response] = await placesClient.getPlace(
    {
      name: `places/${placeId}`,
      sessionToken,
    },
    {
      otherArgs: {
        headers: {
          "X-Goog-Fieldmask": "id,displayName,shortFormattedAddress",
        },
      },
    },
  );

  if (
    !response.id ||
    !response.displayName?.text ||
    !response.shortFormattedAddress
  ) {
    throw new UnknownPlaceError();
  }

  return {
    id: response.id,
    name: response.displayName.text,
    address: response.shortFormattedAddress,
  };
};

export const GOOGLE_PLACES_CACHE_TAG = "google-places";
const CACHE_REVALIDATE = 2_592_000; // 30 DAYS CACHE LIFE

export const getAutocompleteSuggestions = unstable_cache(
  getAutocompleteSuggestionsUncached,
  [],
  { revalidate: CACHE_REVALIDATE, tags: [GOOGLE_PLACES_CACHE_TAG] },
);

export const getPlaceDetails = unstable_cache(getPlaceDetailsUncached, [], {
  revalidate: CACHE_REVALIDATE,
  tags: [GOOGLE_PLACES_CACHE_TAG],
});
