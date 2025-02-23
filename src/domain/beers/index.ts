"server only";

import {
  InvalidBreweryError,
  InvalidSlugError,
  UnknownBeerError,
} from "@/domain/beers/errors";
import { transformRawBeerToBeer } from "@/domain/beers/transforms";
import prisma from "@/lib/prisma";

import type { Beer } from "@/domain/beers/types";

export const getBeerBySlug = async (
  beerSlug: string,
  brewerySlug: string,
): Promise<Beer> => {
  if (brewerySlug.length < 4 || beerSlug.length < 4) {
    throw new InvalidSlugError();
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
};
