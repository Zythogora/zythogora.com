"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
import { getCountry } from "@/lib/i18n/countries";
import { getPaginatedResults } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prepareFullTextSearch, prepareLikeSearch } from "@/lib/prisma/utils";

import type {
  BeerResult,
  BreweryResult,
  UserResult,
} from "@/domain/search/types";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";

export const searchBeers = async ({
  search,
  limit = 20,
  page = 1,
}: PaginationParams<{ search: string }>): Promise<
  PaginatedResults<BeerResult>
> => {
  const likeSearch = prepareLikeSearch(search);
  const fullTextSearch = prepareFullTextSearch(search);

  const [rawBeers, { _count: beerCount }] = await Promise.all([
    prisma.beers.findMany({
      where: {
        OR: [
          { name: { contains: likeSearch, mode: "insensitive" } },
          { name: { search: fullTextSearch, mode: "insensitive" } },
          { brewery: { name: { contains: likeSearch, mode: "insensitive" } } },
          {
            brewery: { name: { search: fullTextSearch, mode: "insensitive" } },
          },
        ],
      },
      include: {
        brewery: true,
        style: true,
        color: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    }),

    prisma.beers.aggregate({
      where: {
        OR: [
          { name: { contains: likeSearch, mode: "insensitive" } },
          { name: { search: fullTextSearch, mode: "insensitive" } },
          { brewery: { name: { contains: likeSearch, mode: "insensitive" } } },
          {
            brewery: { name: { search: fullTextSearch, mode: "insensitive" } },
          },
        ],
      },
      _count: true,
    }),
  ]);

  const beers = await Promise.all(
    rawBeers.map(async ({ brewery, style, color, ...beer }) => ({
      id: beer.id,
      slug: beer.slug,
      name: beer.name,
      brewery: {
        slug: brewery.slug,
        name: brewery.name,
        country: await getCountry(brewery.countryAlpha2Code),
      },
      style: style.name,
      abv: beer.abv,
      ibu: beer.ibu ?? undefined,
      color: transformRawColorToColor(color),
    })),
  );

  return getPaginatedResults(beers, beerCount, page, limit);
};

export const searchBreweries = async ({
  search,
  limit = 20,
  page = 1,
}: PaginationParams<{ search: string }>): Promise<
  PaginatedResults<BreweryResult>
> => {
  const likeSearch = prepareLikeSearch(search);
  const fullTextSearch = prepareFullTextSearch(search);

  const [rawBreweries, { _count: breweryCount }] = await Promise.all([
    prisma.breweries.findMany({
      where: {
        OR: [
          { name: { contains: likeSearch, mode: "insensitive" } },
          { name: { search: fullTextSearch, mode: "insensitive" } },
        ],
      },
      include: {
        _count: { select: { beers: true } },
      },
      take: limit,
      skip: (page - 1) * limit,
    }),

    prisma.breweries.aggregate({
      where: {
        OR: [
          { name: { contains: likeSearch, mode: "insensitive" } },
          { name: { search: fullTextSearch, mode: "insensitive" } },
        ],
      },
      _count: true,
    }),
  ]);

  const breweries = await Promise.all(
    rawBreweries.map(async ({ _count, ...brewery }) => ({
      id: brewery.id,
      slug: brewery.slug,
      name: brewery.name,
      country: await getCountry(brewery.countryAlpha2Code),
      beerCount: _count.beers,
    })),
  );

  return getPaginatedResults(breweries, breweryCount, page, limit);
};

export const searchUsers = async ({
  search,
  limit = 20,
  page = 1,
}: PaginationParams<{ search: string }>): Promise<
  PaginatedResults<UserResult>
> => {
  const likeSearch = prepareLikeSearch(search);
  const fullTextSearch = prepareFullTextSearch(search);

  const [rawUsers, { _count: userCount }] = await Promise.all([
    prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: likeSearch, mode: "insensitive" } },
          { username: { search: fullTextSearch, mode: "insensitive" } },
        ],
      },
      include: { _count: { select: { reviews: true } } },
      take: limit,
      skip: (page - 1) * limit,
    }),

    prisma.users.aggregate({
      where: {
        OR: [
          { username: { contains: likeSearch, mode: "insensitive" } },
          { username: { search: fullTextSearch, mode: "insensitive" } },
        ],
      },
      _count: true,
    }),
  ]);

  const users = rawUsers.map(({ _count, ...user }) => ({
    id: user.id,
    username: user.username,
    reviewCount: _count.reviews,
  }));

  return getPaginatedResults(users, userCount, page, limit);
};
