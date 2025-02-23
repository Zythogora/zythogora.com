"server only";

import { cache } from "react";

import {
  InvalidSlugError,
  UnknownBreweryError,
} from "@/domain/breweries/errors";
import {
  transformRawBreweryBeerToBreweryBeer,
  transformRawBreweryToBrewery,
} from "@/domain/breweries/transforms";
import prisma from "@/lib/prisma";

import type { Brewery, BreweryBeer } from "@/domain/breweries/types";

export const getBreweryBySlug = cache(
  async (brewerySlug: string): Promise<Brewery> => {
    if (brewerySlug.length < 4) {
      throw new InvalidSlugError();
    }

    let brewery = await prisma.breweries.findUnique({
      where: { slug: brewerySlug },
    });

    if (!brewery) {
      brewery = await prisma.breweries.findFirst({
        where: { slug: { startsWith: brewerySlug.slice(0, 4) } },
      });
    }

    if (!brewery) {
      throw new UnknownBreweryError();
    }

    return transformRawBreweryToBrewery(brewery);
  },
);

export const getBreweryBeers = cache(
  async (breweryId: string): Promise<BreweryBeer[]> => {
    const beers = await prisma.beers.findMany({
      where: { brewery: { id: breweryId } },
      include: {
        style: true,
        color: true,
      },
      orderBy: { name: "asc" },
    });

    return beers.map((beer) => transformRawBreweryBeerToBreweryBeer(beer));
  },
);
