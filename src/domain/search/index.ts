"server only";

import { sanitizeFullTextSearch } from "@/lib/prisma";
import prisma from "@/lib/prisma";

import type { BeerResult, BreweryResult } from "@/domain/search/types";

export const searchBeers = async (search: string): Promise<BeerResult[]> => {
  const sanitizedSearch = sanitizeFullTextSearch(search);

  return (
    await prisma.beers.findMany({
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
      take: 20,
    })
  ).map(({ brewery, style, color, ...beer }) => ({
    id: beer.id,
    name: beer.name,
    brewery: {
      name: brewery.name,
      countryCode: brewery.countryAlpha2Code,
    },
    style: style.name,
    abv: beer.abv,
    ibu: beer.ibu ?? undefined,
    color: {
      name: color.name,
      hex: color.hex,
    },
  }));
};

export const searchBreweries = async (
  search: string,
): Promise<BreweryResult[]> => {
  const sanitizedSearch = sanitizeFullTextSearch(search);

  return (
    await prisma.breweries.findMany({
      where: {
        name: { search: sanitizedSearch },
      },
      include: {
        _count: { select: { beers: true } },
      },
      take: 20,
    })
  ).map(({ _count, ...brewery }) => ({
    id: brewery.id,
    name: brewery.name,
    countryCode: brewery.countryAlpha2Code,
    beerCount: _count.beers,
  }));
};
