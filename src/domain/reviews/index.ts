"server only";

import { PurchaseType, type PurchaseLocations } from "@db/client";

import type { ReviewPurchaseTypeData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { getPlaceDetails } from "@/lib/places";
import prisma from "@/lib/prisma";

export const getOrCreatePurchaseLocation = async (
  data: ReviewPurchaseTypeData,
): Promise<PurchaseLocations | undefined> => {
  if (data.purchaseType === PurchaseType.PHYSICAL_LOCATION) {
    if (!data.purchaseLocationId) {
      return undefined;
    }

    const existingPurchaseLocation = await prisma.purchaseLocations.findUnique({
      where: { id: data.purchaseLocationId },
    });

    if (existingPurchaseLocation) {
      return existingPurchaseLocation;
    }

    const placeDetails = await getPlaceDetails(
      data.purchaseLocationId,
      data.googlePlacesSessionToken,
    );

    return prisma.purchaseLocations.create({
      data: {
        id: data.purchaseLocationId,
        type: PurchaseType.PHYSICAL_LOCATION,
        description: placeDetails.name,
        additionalInformation: placeDetails.address,
      },
    });
  }

  if (!data.purchaseStoreUrl) {
    return undefined;
  }

  const existingPurchaseLocation = await prisma.purchaseLocations.findFirst({
    where: {
      type: PurchaseType.ONLINE,
      description: data.purchaseStoreUrl,
    },
  });

  if (existingPurchaseLocation) {
    return existingPurchaseLocation;
  }

  return prisma.purchaseLocations.create({
    data: {
      type: PurchaseType.ONLINE,
      description: data.purchaseStoreUrl,
    },
  });
};
