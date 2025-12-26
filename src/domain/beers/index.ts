"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import type { Prisma } from "@db/client";

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
import { transformRawBeerReviewToBeerReviewWithPicture } from "@/domain/reviews/transforms";
import { getCurrentUser } from "@/lib/auth";
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
import prisma, { getPrismaTransactionClient } from "@/lib/prisma";
import { slugify } from "@/lib/prisma/utils";
import { uploadFile } from "@/lib/storage";
import { StorageBuckets } from "@/lib/storage/constants";
import { getBucketBaseUrl } from "@/lib/storage/utils";

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

export const reviewBeer = async (
  beerId: string,
  review: Omit<CreateReviewData, "beerId">,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedBeerReviewError();
  }

  const beer = await prisma.beers.findUnique({
    where: { id: beerId },
  });

  if (!beer) {
    throw new UnknownBeerError();
  }

  let pictureUrl: string | null = null;
  if (review.picture) {
    const imageBuffer = Buffer.from(await review.picture.arrayBuffer());

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
  }

  const id = nanoid();

  const createdReview = await prisma.reviews.create({
    data: {
      beerId,
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
    },
    include: { beer: { include: { brewery: true } } },
  });

  return createdReview;
};
