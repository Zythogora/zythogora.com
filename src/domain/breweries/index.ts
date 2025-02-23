"server only";

import {
  InvalidSlugError,
  UnknownBreweryError,
} from "@/domain/breweries/errors";
import { transformRawBreweryToBrewery } from "@/domain/breweries/transforms";
import prisma from "@/lib/prisma";

import type { Brewery } from "@/domain/breweries/types";

export const getBreweryBySlug = async (
  brewerySlug: string,
): Promise<Brewery> => {
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
};
