"server only";

import { PurchaseType, type PurchaseLocations } from "@db/client";

import type { ReviewPurchaseTypeData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { PreviewName } from "@/lib/images/types";
import { getPlaceDetails } from "@/lib/places";
import prisma from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";
import { StorageBuckets } from "@/lib/storage/constants";
import { getBucketBaseUrl } from "@/lib/storage/utils";
import { exhaustiveCheck } from "@/lib/typescript/utils";

export const getReviewById = async (reviewId: string) => {
  return prisma.reviews.findUnique({ where: { id: reviewId } });
};

export const deleteReview = async (reviewId: string) => {
  const deletedReview = await prisma.reviews.delete({
    where: { id: reviewId },
  });

  if (deletedReview.pictureUrl) {
    const baseFileName = deletedReview.pictureUrl.replace(
      getBucketBaseUrl(StorageBuckets.REVIEW_PICTURES),
      "",
    );

    await Promise.all([
      deleteFile({
        bucketName: StorageBuckets.REVIEW_PICTURES,
        fileName: baseFileName,
      }),
      ...Object.values(PreviewName).map((previewName) =>
        deleteFile({
          bucketName: StorageBuckets.REVIEW_PICTURES,
          fileName: baseFileName.replace(`.jpg`, `_${previewName}.jpg`),
        }),
      ),
    ]);
  }
};

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
