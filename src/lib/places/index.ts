import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { UnknownPlaceError } from "@/lib/places/errors";
import { placesClient } from "@/lib/places/gcp";
import { transformAutocompletePlacesSuggestionToAutocompleteLocation } from "@/lib/places/transforms";
import type { AutocompleteLocation, Place } from "@/lib/places/types";

export const GOOGLE_PLACES_CACHE_TAG = "google-places";

export async function getAutocompleteSuggestions(
  input: string,
  sessionToken: string,
): Promise<AutocompleteLocation[]> {
  "use cache";
  cacheLife("places");
  cacheTag(GOOGLE_PLACES_CACHE_TAG);

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
}

export async function getPlaceDetails(
  placeId: string,
  sessionToken: string,
): Promise<Place> {
  "use cache";
  cacheLife("places");
  cacheTag(GOOGLE_PLACES_CACHE_TAG);

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
}
