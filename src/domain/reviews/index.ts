"server only";

import { nanoid } from "nanoid";

import { PurchaseType, type PurchaseLocations } from "@db/client";

import type { ReviewActionData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import type { ReviewPurchaseTypeData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import {
  ExplicitContentCheckError,
  ExplicitContentError,
  FileUploadError,
  ImageOptimizationError,
  UnknownPurchaseLocationError,
} from "@/domain/beers/errors";
import {
  ForbiddenReviewEditError,
  UnknownReviewError,
} from "@/domain/users/errors";
import { getCurrentUser } from "@/lib/auth";
import {
  checkImageForExplicitContent,
  createPreviews,
  optimizeImage,
} from "@/lib/images";
import { PreviewName } from "@/lib/images/types";
import { getPlaceDetails } from "@/lib/places";
import { UnknownPlaceError } from "@/lib/places/errors";
import prisma from "@/lib/prisma";
import { deleteFile, uploadFile } from "@/lib/storage";
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

export const updateReview = async (data: ReviewActionData) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new ForbiddenReviewEditError();
  }

  if (!data.reviewId) {
    throw new UnknownReviewError();
  }

  const existingReview = await prisma.reviews.findUnique({
    where: { id: data.reviewId },
  });

  if (!existingReview) {
    throw new UnknownReviewError();
  }

  if (existingReview.userId !== user.id) {
    throw new ForbiddenReviewEditError();
  }

  let pictureUrl: string | null = existingReview.pictureUrl;
  const oldPictureUrl = existingReview.pictureUrl;

  if (data.removePicture && !data.picture) {
    pictureUrl = null;

    if (oldPictureUrl) {
      const oldBaseFileName = oldPictureUrl.replace(
        getBucketBaseUrl(StorageBuckets.REVIEW_PICTURES),
        "",
      );

      await Promise.all([
        deleteFile({
          bucketName: StorageBuckets.REVIEW_PICTURES,
          fileName: oldBaseFileName,
        }),
        ...Object.values(PreviewName).map((previewName) =>
          deleteFile({
            bucketName: StorageBuckets.REVIEW_PICTURES,
            fileName: oldBaseFileName.replace(`.jpg`, `_${previewName}.jpg`),
          }),
        ),
      ]).catch((error) => {
        console.error("Failed to delete old picture", error);
      });
    }
  } else if (data.picture) {
    const imageBuffer = Buffer.from(await data.picture.arrayBuffer());

    const [explicitContentResult, optimizedImageResult] =
      await Promise.allSettled([
        checkImageForExplicitContent(imageBuffer),
        optimizeImage(imageBuffer),
      ]);

    if (explicitContentResult.status === "rejected") {
      console.error(
        "Failed to check for explicit content",
        explicitContentResult.reason,
      );
      throw new ExplicitContentCheckError();
    }

    if (optimizedImageResult.status === "rejected") {
      console.error("Failed to optimize image", optimizedImageResult.reason);
      throw new ImageOptimizationError();
    }

    const { isExplicit, detections } = explicitContentResult.value;
    const optimizedImage = optimizedImageResult.value;

    if (isExplicit) {
      console.error(`Explicit content detected: ${JSON.stringify(detections)}`);
      throw new ExplicitContentError();
    }

    const fileId = nanoid();
    const baseFileName = `${user.id}/${fileId}.jpg`;

    try {
      await Promise.all([
        uploadFile({
          bucketName: StorageBuckets.REVIEW_PICTURES,
          fileName: baseFileName,
          fileBody: optimizedImage,
          contentType: "image/jpeg",
        }),
        ...Object.entries(await createPreviews(optimizedImage)).map(
          ([name, image]) =>
            uploadFile({
              bucketName: StorageBuckets.REVIEW_PICTURES,
              fileName: `${user.id}/${fileId}_${name}.jpg`,
              fileBody: image,
              contentType: "image/jpeg",
            }),
        ),
      ]);
    } catch (error) {
      console.error("Failed to upload image", error);
      throw new FileUploadError();
    }

    pictureUrl = `${getBucketBaseUrl(StorageBuckets.REVIEW_PICTURES)}${baseFileName}`;

    // Delete old picture after successful upload
    if (oldPictureUrl) {
      const oldBaseFileName = oldPictureUrl.replace(
        getBucketBaseUrl(StorageBuckets.REVIEW_PICTURES),
        "",
      );

      await Promise.all([
        deleteFile({
          bucketName: StorageBuckets.REVIEW_PICTURES,
          fileName: oldBaseFileName,
        }),
        ...Object.values(PreviewName).map((previewName) =>
          deleteFile({
            bucketName: StorageBuckets.REVIEW_PICTURES,
            fileName: oldBaseFileName.replace(`.jpg`, `_${previewName}.jpg`),
          }),
        ),
      ]).catch((error) => {
        // Log but don't fail the update if old picture deletion fails
        console.error("Failed to delete old picture", error);
      });
    }
  }

  const purchaseLocation = await getOrCreatePurchaseLocation(
    data,
    user.id,
  ).catch((error) => {
    if (error instanceof UnknownPlaceError) {
      console.error(
        `Unknown purchase location: ${data.purchaseType === PurchaseType.PHYSICAL_LOCATION ? data.purchaseLocationId : ""}`,
      );
      throw new UnknownPurchaseLocationError();
    }

    console.error("Unknown error getting purchase location", error);
    return undefined;
  });

  const updatedReview = await prisma.reviews.update({
    where: { id: data.reviewId },
    data: {
      globalScore: data.globalScore,
      servingFrom: data.servingFrom,
      bestBeforeDate: data.bestBeforeDate,
      comment: data.comment,
      pictureUrl,

      labelDesign: data.labelDesign,
      haziness: data.haziness,
      headRetention: data.headRetention,

      aromasIntensity: data.aromasIntensity,

      flavorsIntensity: data.flavorsIntensity,
      bodyStrength: data.bodyStrength,
      carbonationIntensity: data.carbonationIntensity,
      bitterness: data.bitterness,
      acidity: data.acidity,

      duration: data.duration,

      purchaseLocationId: purchaseLocation?.id,
      price: data.price,
      priceCurrency: data.price != undefined ? data.priceCurrency : undefined,

      updatedAt: new Date(),
    },
    include: {
      user: true,
      beer: { include: { brewery: true } },
    },
  });

  return updatedReview;
};
