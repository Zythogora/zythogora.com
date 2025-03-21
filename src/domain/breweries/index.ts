"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import {
  InvalidBrewerySlugError,
  UnauthorizedBreweryCreationError,
  UnknownBreweryError,
} from "@/domain/breweries/errors";
import {
  transformRawBreweryReviewToBreweryReview,
  transformRawBreweryToBrewery,
} from "@/domain/breweries/transforms";
import { getCurrentUser } from "@/lib/auth";
import { getPaginatedResults } from "@/lib/pagination";
import prisma, { getPrismaTransactionClient } from "@/lib/prisma";
import { slugify } from "@/lib/prisma/utils";

import type { CreateBreweryData } from "@/app/[locale]/(business)/(without-header)/create/brewery/schemas";
import type { Brewery, BreweryReview } from "@/domain/breweries/types";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";
import type { Prisma } from "@prisma/client";

export const getBreweryBySlug = cache(
  async (brewerySlug: string): Promise<Brewery> => {
    if (brewerySlug.length < 4) {
      throw new InvalidBrewerySlugError();
    }

    let brewery = await prisma.breweries.findUnique({
      where: { slug: brewerySlug },
      include: {
        beers: {
          include: {
            style: true,
            color: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!brewery) {
      brewery = await prisma.breweries.findFirst({
        where: { slug: { startsWith: brewerySlug.slice(0, 4) } },
        include: {
          beers: {
            include: {
              style: true,
              color: true,
            },
            orderBy: { name: "asc" },
          },
        },
      });
    }

    if (!brewery) {
      throw new UnknownBreweryError();
    }

    return transformRawBreweryToBrewery(brewery);
  },
);

interface GetBreweryReviewsParams {
  userId: string;
  brewerySlug: string;
}

export const getBreweryReviewsByUser = async ({
  userId,
  brewerySlug,
  limit = 10,
  page = 1,
}: PaginationParams<GetBreweryReviewsParams>): Promise<
  PaginatedResults<BreweryReview>
> => {
  const query = {
    where: {
      user: { id: userId },
      beer: { brewery: { slug: brewerySlug } },
    },
    include: {
      user: true,
      beer: { include: { style: true, color: true } },
    },
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

  const reviews = rawReviews.map(transformRawBreweryReviewToBreweryReview);

  return getPaginatedResults(reviews, reviewCount, page, limit);
};

export const getBreweryFriendReviewsForUser = async ({
  userId,
  brewerySlug,
  limit = 10,
  page = 1,
}: PaginationParams<GetBreweryReviewsParams>): Promise<
  PaginatedResults<BreweryReview>
> => {
  const query = {
    where: {
      user: { friendWith: { some: { userBId: userId } } },
      beer: { brewery: { slug: brewerySlug } },
    },
    include: {
      user: true,
      beer: { include: { style: true, color: true } },
    },
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

  const reviews = rawReviews.map(transformRawBreweryReviewToBreweryReview);

  return getPaginatedResults(reviews, reviewCount, page, limit);
};

export const createBrewery = async (data: CreateBreweryData) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedBreweryCreationError();
  }

  const id = nanoid();

  const brewery = await prisma.breweries.create({
    data: {
      id,
      slug: slugify(id, data.name),
      name: data.name,
      countryAlpha2Code: data.country,
      state: data.state ?? null,
      city: data.city ?? null,
      address: data.address ?? null,
      description: data.description ?? null,
      websiteLink: data.websiteLink ?? null,
      socialLinks: data.socialLinks ?? null,
      contactEmail: data.contactEmail ?? null,
      contactPhoneNumber: data.contactPhoneNumber ?? null,
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  return brewery;
};
