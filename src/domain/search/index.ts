"server only";

import { getCountry } from "@/lib/i18n/countries";
import { getPaginatedResults } from "@/lib/pagination";
import { sanitizeFullTextSearch } from "@/lib/prisma";
import prisma from "@/lib/prisma";

import type { BeerResult, BreweryResult } from "@/domain/search/types";
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
  const sanitizedSearch = sanitizeFullTextSearch(search);

  const [rawBeers, { _count: beerCount }] = await Promise.all([
    prisma.beers.findMany({
      where: {
        OR: [
          { name: { search: sanitizedSearch } },
          { brewery: { name: { search: sanitizedSearch } } },
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
          { name: { search: sanitizedSearch } },
          { brewery: { name: { search: sanitizedSearch } } },
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
      color: {
        name: color.name,
        hex: color.hex,
      },
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
  const sanitizedSearch = sanitizeFullTextSearch(search);

  const [rawBreweries, { _count: breweryCount }] = await Promise.all([
    prisma.breweries.findMany({
      where: {
        name: { search: sanitizedSearch },
      },
      include: {
        _count: { select: { beers: true } },
      },
      take: limit,
      skip: (page - 1) * limit,
    }),

    prisma.breweries.aggregate({
      where: {
        name: { search: sanitizedSearch },
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
