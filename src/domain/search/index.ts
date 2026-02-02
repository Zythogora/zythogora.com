"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
import type {
  BeerResult,
  BreweryResult,
  UserResult,
} from "@/domain/search/types";
import { getCountry } from "@/lib/i18n/countries";
import { getPaginatedResults } from "@/lib/pagination";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";
import prisma from "@/lib/prisma";

interface SearchResultWithScore {
  id: string;
  score: number;
  total_count: bigint;
}

export const searchBeers = async ({
  search,
  limit = 20,
  page = 1,
}: PaginationParams<{ search: string }>): Promise<
  PaginatedResults<BeerResult>
> => {
  const trimmed = search.trim();

  if (!trimmed) {
    return getPaginatedResults([], 0, page, limit);
  }

  const offset = (page - 1) * limit;

  const searchResults = await prisma.$queryRaw<SearchResultWithScore[]>`
    SELECT
      b.id,
      GREATEST(
        CASE WHEN f_unaccent(lower(b.name)) = f_unaccent(lower(${trimmed})) THEN 100.0 ELSE 0 END,
        CASE WHEN f_unaccent(lower(br.name)) = f_unaccent(lower(${trimmed})) THEN 80.0 ELSE 0 END,
        CASE WHEN f_unaccent(lower(b.name)) LIKE f_unaccent(lower(${trimmed})) || '%' THEN 60.0 ELSE 0 END,
        CASE WHEN f_unaccent(lower(br.name)) LIKE f_unaccent(lower(${trimmed})) || '%' THEN 50.0 ELSE 0 END,
        similarity(f_unaccent(lower(b.name)), f_unaccent(lower(${trimmed}))) * 40,
        similarity(f_unaccent(lower(br.name)), f_unaccent(lower(${trimmed}))) * 30
      ) as score,
      COUNT(*) OVER() as total_count
    FROM beer_data.beers b
    JOIN beer_data.breweries br ON b.brewery_id = br.id
    WHERE
      f_unaccent(lower(b.name)) % f_unaccent(lower(${trimmed}))
      OR f_unaccent(lower(br.name)) % f_unaccent(lower(${trimmed}))
      OR f_unaccent(lower(b.name)) LIKE '%' || f_unaccent(lower(${trimmed})) || '%'
      OR f_unaccent(lower(br.name)) LIKE '%' || f_unaccent(lower(${trimmed})) || '%'
    ORDER BY score DESC, b.name ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const firstResult = searchResults.at(0);
  if (!firstResult) {
    return getPaginatedResults([], 0, page, limit);
  }

  const ids = searchResults.map((r) => r.id);
  const beerCount = Number(firstResult.total_count);

  const rawBeers = await prisma.beers.findMany({
    where: { id: { in: ids } },
    include: {
      brewery: true,
      style: true,
      color: true,
    },
  });

  // Re-sort to preserve relevance order
  const idToIndex = new Map(ids.map((id, i) => [id, i]));
  rawBeers.sort((a, b) => idToIndex.get(a.id)! - idToIndex.get(b.id)!);

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
  const trimmed = search.trim();

  if (!trimmed) {
    return getPaginatedResults([], 0, page, limit);
  }

  const offset = (page - 1) * limit;

  const searchResults = await prisma.$queryRaw<SearchResultWithScore[]>`
    SELECT
      br.id,
      GREATEST(
        CASE WHEN f_unaccent(lower(br.name)) = f_unaccent(lower(${trimmed})) THEN 100.0 ELSE 0 END,
        CASE WHEN f_unaccent(lower(br.name)) LIKE f_unaccent(lower(${trimmed})) || '%' THEN 70.0 ELSE 0 END,
        similarity(f_unaccent(lower(br.name)), f_unaccent(lower(${trimmed}))) * 50
      ) as score,
      COUNT(*) OVER() as total_count
    FROM beer_data.breweries br
    WHERE
      f_unaccent(lower(br.name)) % f_unaccent(lower(${trimmed}))
      OR f_unaccent(lower(br.name)) LIKE '%' || f_unaccent(lower(${trimmed})) || '%'
    ORDER BY score DESC, br.name ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const firstResult = searchResults.at(0);
  if (!firstResult) {
    return getPaginatedResults([], 0, page, limit);
  }

  const ids = searchResults.map((r) => r.id);
  const breweryCount = Number(firstResult.total_count);

  const rawBreweries = await prisma.breweries.findMany({
    where: { id: { in: ids } },
    include: {
      _count: { select: { beers: true } },
    },
  });

  // Re-sort to preserve relevance order
  const idToIndex = new Map(ids.map((id, i) => [id, i]));
  rawBreweries.sort((a, b) => idToIndex.get(a.id)! - idToIndex.get(b.id)!);

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
  const trimmed = search.trim();

  if (!trimmed) {
    return getPaginatedResults([], 0, page, limit);
  }

  const offset = (page - 1) * limit;

  const searchResults = await prisma.$queryRaw<SearchResultWithScore[]>`
    SELECT
      u.id,
      GREATEST(
        CASE WHEN f_unaccent(lower(u.username)) = f_unaccent(lower(${trimmed})) THEN 100.0 ELSE 0 END,
        CASE WHEN f_unaccent(lower(u.username)) LIKE f_unaccent(lower(${trimmed})) || '%' THEN 70.0 ELSE 0 END,
        similarity(f_unaccent(lower(u.username)), f_unaccent(lower(${trimmed}))) * 50
      ) as score,
      COUNT(*) OVER() as total_count
    FROM public.users u
    WHERE
      f_unaccent(lower(u.username)) % f_unaccent(lower(${trimmed}))
      OR f_unaccent(lower(u.username)) LIKE '%' || f_unaccent(lower(${trimmed})) || '%'
    ORDER BY score DESC, u.username ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const firstResult = searchResults.at(0);
  if (!firstResult) {
    return getPaginatedResults([], 0, page, limit);
  }

  const ids = searchResults.map((r) => r.id);
  const userCount = Number(firstResult.total_count);

  const rawUsers = await prisma.users.findMany({
    where: { id: { in: ids } },
    include: { _count: { select: { reviews: true } } },
  });

  // Re-sort to preserve relevance order
  const idToIndex = new Map(ids.map((id, i) => [id, i]));
  rawUsers.sort((a, b) => idToIndex.get(a.id)! - idToIndex.get(b.id)!);

  const users = rawUsers.map(({ _count, ...user }) => ({
    id: user.id,
    username: user.username,
    reviewCount: _count.reviews,
  }));

  return getPaginatedResults(users, userCount, page, limit);
};
