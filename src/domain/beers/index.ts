import "server-only";

import { nanoid } from "nanoid";
import { cache } from "react";

import { PurchaseType, type Prisma } from "@db/client";

import type { CreateReviewData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import type { CreateBeerData } from "@/app/[locale]/(business)/(without-header)/create/beer/schemas";
import {
  InvalidBreweryError,
  InvalidBeerSlugError,
  UnknownBeerError,
  UnauthorizedBeerReviewError,
  UnauthorizedBeerCreationError,
  ExplicitContentError,
  FileUploadError,
  ImageOptimizationError,
  ExplicitContentCheckError,
  UnknownPurchaseLocationError,
} from "@/domain/beers/errors";
import {
  transformRawBeerReviewToBeerReview,
  transformRawBeerToBeer,
  transformRawColorToColor,
  transformRawStyleCategoryToStyleCategory,
} from "@/domain/beers/transforms";
import type {
  Beer,
  BeerReview,
  Color,
  StyleCategory,
} from "@/domain/beers/types";
import { getOrCreatePurchaseLocation } from "@/domain/reviews";
import { transformRawBeerReviewToBeerReviewWithPicture } from "@/domain/reviews/transforms";
import { getCurrentUser } from "@/lib/auth";
import { config } from "@/lib/config";
import {
  addToSpan,
  addUserToSpan,
  addReviewToSpan,
  recordError,
} from "@/lib/logger";
import {
  checkImageForExplicitContent,
  createPreviews,
  optimizeImage,
} from "@/lib/images";
import { getPaginatedResults } from "@/lib/pagination";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";
import { UnknownPlaceError } from "@/lib/places/errors";
import prisma, { getPrismaTransactionClient } from "@/lib/prisma";
import { slugify } from "@/lib/prisma/utils";
import { transformRawStatsToAggregateRating } from "@/lib/seo/transforms";
import { uploadFile } from "@/lib/storage";

export const getBeerBySlug = cache(
  async (beerSlug: string, brewerySlug: string): Promise<Beer> => {
    if (brewerySlug.length < 4 || beerSlug.length < 4) {
      throw new InvalidBeerSlugError();
    }

    let beer = await prisma.beers.findUnique({
      where: { slug: beerSlug },
      include: {
        brewery: true,
        style: true,
        color: true,
      },
    });

    if (!beer) {
      beer = await prisma.beers.findFirst({
        where: {
          AND: [
            { slug: { startsWith: beerSlug.slice(0, 4) } },
            {
              OR: [
                { brewery: { slug: brewerySlug } },
                { brewery: { slug: { startsWith: brewerySlug.slice(0, 4) } } },
              ],
            },
          ],
        },
        include: {
          brewery: true,
          style: true,
          color: true,
        },
      });
    }

    if (!beer) {
      throw new UnknownBeerError();
    }

    if (!beer.brewery.slug.startsWith(brewerySlug)) {
      throw new InvalidBreweryError();
    }

    return transformRawBeerToBeer(beer);
  },
);

export const getBeerAggregateRatingById = async (beerId: string) => {
  const result = await prisma.reviews.aggregate({
    where: { beerId },
    _avg: { globalScore: true },
    _count: true,
  });

  return transformRawStatsToAggregateRating({
    count: result._count,
    average: result._avg.globalScore,
  });
};

export const getColors = async (): Promise<Color[]> => {
  const colors = await prisma.colors.findMany();

  return colors.map(transformRawColorToColor);
};

export const getStyleCategories = async (): Promise<StyleCategory[]> => {
  const categories = await prisma.styleCategories.findMany({
    include: { styles: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return categories.map(transformRawStyleCategoryToStyleCategory);
};

interface GetBeerReviewsParams {
  userId: string;
  beerId: string;
}

export const getBeerReviewsByUser = async ({
  userId,
  beerId,
  limit = 10,
  page = 1,
}: PaginationParams<GetBeerReviewsParams>): Promise<
  PaginatedResults<BeerReview>
> => {
  const query = {
    where: { userId, beerId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  } satisfies Prisma.ReviewsFindManyArgs;

  const [rawReviews, reviewCount] = await getPrismaTransactionClient()(
    async (tx) =>
      Promise.all([
        tx.reviews.findMany(query),
        tx.reviews.count({ where: query.where }),
      ]),
  );

  const reviews = rawReviews.map(transformRawBeerReviewToBeerReview);

  return getPaginatedResults(reviews, reviewCount, page, limit);
};

export const getYourLatestPictures = async ({
  userId,
  beerId,
  count = 5,
}: {
  userId: string;
  beerId: string;
  count?: number;
}) => {
  return prisma.reviews
    .findMany({
      where: { userId, beerId, pictureUrl: { not: null } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: count,
    })
    .then((rawReviews) =>
      rawReviews.map(transformRawBeerReviewToBeerReviewWithPicture),
    );
};

export const getBeerFriendReviewsForUser = async ({
  userId,
  beerId,
  limit = 10,
  page = 1,
}: PaginationParams<GetBeerReviewsParams>): Promise<
  PaginatedResults<BeerReview>
> => {
  const query = {
    where: {
      user: { friendWith: { some: { userBId: userId } } },
      beerId,
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  } satisfies Prisma.ReviewsFindManyArgs;

  const [rawReviews, reviewCount] = await getPrismaTransactionClient()(
    async (tx) =>
      Promise.all([
        tx.reviews.findMany(query),
        tx.reviews.count({ where: query.where }),
      ]),
  );

  const reviews = rawReviews.map(transformRawBeerReviewToBeerReview);

  return getPaginatedResults(reviews, reviewCount, page, limit);
};

export const getLatestFriendPictures = async ({
  userId,
  beerId,
  count = 5,
}: {
  userId: string;
  beerId: string;
  count?: number;
}) => {
  return prisma.reviews
    .findMany({
      where: {
        user: { friendWith: { some: { userBId: userId } } },
        beerId,
        pictureUrl: { not: null },
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: count,
    })
    .then((rawReviews) =>
      rawReviews.map(transformRawBeerReviewToBeerReviewWithPicture),
    );
};

export const getAllBeerReviews = async ({
  beerId,
  limit = 10,
  page = 1,
}: PaginationParams<{ beerId: string }>): Promise<
  PaginatedResults<BeerReview>
> => {
  const query = {
    where: { beerId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  } satisfies Prisma.ReviewsFindManyArgs;

  const [rawReviews, reviewCount] = await getPrismaTransactionClient()(
    async (tx) =>
      Promise.all([
        tx.reviews.findMany(query),
        tx.reviews.count({ where: query.where }),
      ]),
  );

  const reviews = rawReviews.map(transformRawBeerReviewToBeerReview);

  return getPaginatedResults(reviews, reviewCount, page, limit);
};

export const getLatestPublicPictures = async ({
  beerId,
  count = 5,
}: {
  beerId: string;
  count?: number;
}) => {
  return prisma.reviews
    .findMany({
      where: { beerId, pictureUrl: { not: null } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: count,
    })
    .then((rawReviews) =>
      rawReviews.map(transformRawBeerReviewToBeerReviewWithPicture),
    );
};

export const createBeer = async (data: CreateBeerData) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedBeerCreationError();
  }

  addUserToSpan(user);

  const id = nanoid();

  const beer = await prisma.beers.create({
    data: {
      id,
      slug: slugify(id, data.name),
      name: data.name,
      abv: data.abv,
      ibu: data.ibu,
      description: data.description,
      releaseYear: data.releaseYear,
      organic: data.organic,
      barrelAged: data.barrelAged,
      breweryId: data.breweryId,
      styleId: data.styleId,
      colorId: data.colorId,
      createdBy: user.id,
      updatedBy: user.id,
    },
    include: { brewery: true },
  });

  return beer;
};

export const reviewBeer = async (review: CreateReviewData) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedBeerReviewError();
  }

  addUserToSpan(user);
  addReviewToSpan(review);

  const beer = await prisma.beers.findUnique({
    where: { id: review.beerId },
  });

  if (!beer) {
    throw new UnknownBeerError();
  }

  addToSpan({ "beer.id": beer.id, "beer.name": beer.name });

  let pictureUrl: string | null = null;
  if (review.picture) {
    const imageBuffer = Buffer.from(await review.picture.arrayBuffer());

    const [explicitContentResult, optimizedImageResult] =
      await Promise.allSettled([
        checkImageForExplicitContent(imageBuffer),
        optimizeImage(imageBuffer),
      ]);

    if (explicitContentResult.status === "rejected") {
      recordError(explicitContentResult.reason);
      addToSpan({ "review.error": "explicit_content_check_failed" });
      throw new ExplicitContentCheckError();
    }

    if (optimizedImageResult.status === "rejected") {
      recordError(optimizedImageResult.reason);
      addToSpan({ "review.error": "image_optimization_failed" });
      throw new ImageOptimizationError();
    }

    const { isExplicit, detections } = explicitContentResult.value;
    const optimizedImage = optimizedImageResult.value;

    if (isExplicit) {
      const flaggedFileId = nanoid();
      const flaggedFileName = `${user.id}/${flaggedFileId}.jpg`;

      const spanAttrs: Record<string, string | boolean> = {
        "review.explicit_content": true,
        "review.explicit_content.adult": detections?.adult ?? "UNKNOWN",
        "review.explicit_content.racy": detections?.racy ?? "UNKNOWN",
        "review.explicit_content.violence": detections?.violence ?? "UNKNOWN",
        "review.explicit_content.spoof": detections?.spoof ?? "UNKNOWN",
        "review.explicit_content.medical": detections?.medical ?? "UNKNOWN",
      };

      try {
        await uploadFile({
          bucketName: "flagged-images",
          fileName: flaggedFileName,
          fileBody: optimizedImage,
          contentType: "image/jpeg",
        });
        spanAttrs["review.explicit_content.flagged_image_url"] =
          `${config.supabase.storageUrl}/object/public/flagged-images/${flaggedFileName}`;
      } catch {
        // Best-effort — don't block the error response if upload fails
      }

      addToSpan(spanAttrs);
      throw new ExplicitContentError();
    }

    const bucketName = "review-pictures";
    const fileId = nanoid();
    const baseFileName = `${user.id}/${fileId}.jpg`;

    try {
      await Promise.all([
        uploadFile({
          bucketName,
          fileName: baseFileName,
          fileBody: optimizedImage,
          contentType: "image/jpeg",
        }),

        Promise.all(
          (await createPreviews(optimizedImage)).map(({ name, image }) =>
            uploadFile({
              bucketName,
              fileName: `${user.id}/${fileId}_${name}.jpg`,
              fileBody: image,
              contentType: "image/jpeg",
            }),
          ),
        ),
      ]);
    } catch (error) {
      recordError(error);
      addToSpan({ "review.error": "file_upload_failed" });
      throw new FileUploadError();
    }

    pictureUrl = `${config.supabase.storageUrl}/object/public/${bucketName}/${baseFileName}`;
  }

  const purchaseLocation = await getOrCreatePurchaseLocation(
    review,
    user.id,
  ).catch((error) => {
    if (error instanceof UnknownPlaceError) {
      addToSpan({
        "review.error": "unknown_purchase_location",
        "review.purchase_location_id":
          review.purchaseType === PurchaseType.PHYSICAL_LOCATION
            ? (review.purchaseLocationId ?? "")
            : "",
      });
      throw new UnknownPurchaseLocationError();
    }

    recordError(error);
    addToSpan({ "review.error": "purchase_location_fetch_failed" });
    return undefined;
  });

  const id = nanoid();

  const createdReview = await prisma.reviews.create({
    data: {
      beerId: review.beerId,
      userId: user.id,

      id,
      slug: slugify(id, beer.name),

      globalScore: review.globalScore,
      servingFrom: review.servingFrom,
      bestBeforeDate: review.bestBeforeDate,
      comment: review.comment,
      pictureUrl,

      labelDesign: review.labelDesign,
      haziness: review.haziness,
      headRetention: review.headRetention,

      aromasIntensity: review.aromasIntensity,

      flavorsIntensity: review.flavorsIntensity,
      bodyStrength: review.bodyStrength,
      carbonationIntensity: review.carbonationIntensity,
      bitterness: review.bitterness,
      acidity: review.acidity,

      duration: review.duration,

      purchaseLocationId: purchaseLocation?.id,
      price: review.price,
      priceCurrency:
        review.price != undefined ? review.priceCurrency : undefined,
    },
    include: { beer: { include: { brewery: true } } },
  });

  addToSpan({ "review.id": createdReview.id });

  return createdReview;
};
