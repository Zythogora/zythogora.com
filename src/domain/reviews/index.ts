"server only";

import { PurchaseType, type PurchaseLocations } from "@db/client";

import type { ReviewPurchaseTypeData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { getPlaceDetails } from "@/lib/places";
import prisma from "@/lib/prisma";
import { exhaustiveCheck } from "@/lib/typescript/utils";

export const getOrCreatePurchaseLocation = async (
  data: ReviewPurchaseTypeData,
  userId: string,
): Promise<PurchaseLocations | undefined> => {
  const { purchaseType } = data;

  switch (purchaseType) {
    case PurchaseType.PHYSICAL_LOCATION: {
      if (!data.purchaseLocationId) {
        return undefined;
      }

      const existingPurchaseLocation =
        await prisma.purchaseLocations.findUnique({
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
          createdBy: userId,
          updatedBy: userId,
        },
      });
    }

    case PurchaseType.ONLINE: {
      if (!data.purchaseStoreUrl) {
        return undefined;
      }

      const existingPurchaseLocation = await prisma.purchaseLocations.findFirst(
        {
          where: {
            type: PurchaseType.ONLINE,
            description: data.purchaseStoreUrl,
          },
        },
      );

      if (existingPurchaseLocation) {
        return existingPurchaseLocation;
      }

      return prisma.purchaseLocations.create({
        data: {
          type: PurchaseType.ONLINE,
          description: data.purchaseStoreUrl,
          createdBy: userId,
          updatedBy: userId,
        },
      });
    }

    default: {
      throw exhaustiveCheck({
        value: purchaseType,
        error: "Unknown purchase type",
      });
    }
  }
};
