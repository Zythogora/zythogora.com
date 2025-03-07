"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import {
  InvalidBrewerySlugError,
  UnauthorizedBreweryCreationError,
  UnknownBreweryError,
} from "@/domain/breweries/errors";
import { transformRawBreweryToBrewery } from "@/domain/breweries/transforms";
import { getCurrentUser } from "@/lib/auth";
import prisma, { slugify } from "@/lib/prisma";

import type { CreateBreweryData } from "@/app/[locale]/(forms)/create/brewery/schemas";
import type { Brewery } from "@/domain/breweries/types";

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
