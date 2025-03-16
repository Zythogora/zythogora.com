"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import {
  InvalidBreweryError,
  InvalidBeerSlugError,
  UnknownBeerError,
  UnauthorizedBeerReviewError,
  UnauthorizedBeerCreationError,
} from "@/domain/beers/errors";
import {
  transformRawBeerReviewToBeerReview,
  transformRawBeerToBeer,
  transformRawColorToColor,
  transformRawStyleCategoryToStyleCategory,
} from "@/domain/beers/transforms";
import { getCurrentUser } from "@/lib/auth";
import { getPaginatedResults } from "@/lib/pagination";
import prisma, { slugify } from "@/lib/prisma";

import type { CreateReviewData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import type { CreateBeerData } from "@/app/[locale]/(business)/(without-header)/create/beer/schemas";
import type {
  Beer,
  BeerReview,
  Color,
  StyleCategory,
} from "@/domain/beers/types";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";

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

export const getReviewsByBeer = cache(
  async ({
    beerId,
    limit = 20,
    page = 1,
  }: PaginationParams<{ beerId: string }>): Promise<
    PaginatedResults<BeerReview>
  > => {
    const [rawReviews, reviewCount] = await Promise.all([
      prisma.reviews.findMany({
        where: { beerId },
        include: {
          user: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.reviews.count({
        where: { beerId },
      }),
    ]);

    const reviews = rawReviews.map(transformRawBeerReviewToBeerReview);

    return getPaginatedResults(reviews, reviewCount, page, limit);
  },
);

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

  const id = nanoid();

  const createdReview = await prisma.reviews.create({
    data: {
      beerId,
      userId: user.id,

      id: nanoid(),
      slug: slugify(id, beer.slug),

      globalScore: review.globalScore,
      servingFrom: review.servingFrom,
      comment: review.comment,

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
