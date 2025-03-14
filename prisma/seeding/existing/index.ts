import { PrismaClient, ServingFrom } from "@prisma/client";
import { customAlphabet, nanoid } from "nanoid";

import { slugify } from "@/lib/prisma";
import { existing_beers } from "prisma/seeding/existing/data/beers";
import { existing_breweries } from "prisma/seeding/existing/data/breweries";
import { existing_colors } from "prisma/seeding/existing/data/colors";
import { existing_reviews } from "prisma/seeding/existing/data/reviews";
import { existing_styles } from "prisma/seeding/existing/data/styles";
import { existingUsers } from "prisma/seeding/existing/data/users";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(
    async (tx) => {
      const betterAuthNanoId = customAlphabet(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        32,
      );

      const userIdsMap = existingUsers.reduce<Record<string, string>>(
        (acc, user) => {
          acc[`${user.uuid}`] = betterAuthNanoId();
          return acc;
        },
        {},
      );

      await tx.betterAuthUsers.createMany({
        data: existingUsers.map((user) => ({
          id: userIdsMap[user.uuid]!,
          name: user.username,
          email: user.email,
          emailVerified: true,
          createdAt: new Date(user.creation_time),
          updatedAt: new Date(user.creation_time),
        })),
      });

      await tx.accounts.createMany({
        data: existingUsers.map((user) => ({
          id: betterAuthNanoId(),
          accountId: userIdsMap[user.uuid]!,
          providerId: "credential",
          userId: userIdsMap[user.uuid]!,
          password: user.password_hash,
          createdAt: new Date(user.creation_time),
          updatedAt: new Date(user.creation_time),
        })),
      });

      await tx.users.createMany({
        data: existingUsers.map((user) => ({
          id: userIdsMap[user.uuid]!,
          username: user.username,
        })),
      });

      const colorIdsMap = existing_colors.reduce<Record<string, string>>(
        (acc, val) => {
          acc[`${val.id}`] = nanoid();
          return acc;
        },
        {},
      );

      const otherColorId = nanoid();

      await tx.colors.createMany({
        data: [
          ...existing_colors.map((color) => ({
            id: colorIdsMap[color.id]!,
            name: color.name,
            hex: color.color,
            srmMin: 0,
            srmMax: 0,
          })),
          {
            id: otherColorId,
            name: "Other",
            hex: "ffffff",
            srmMin: 0,
            srmMax: 40,
          },
        ],
      });

      const styleIdsMap = existing_styles.reduce<Record<string, string>>(
        (acc, val) => {
          acc[`${val.id}`] = nanoid();
          return acc;
        },
        {},
      );

      await tx.legacyStyles.createMany({
        data: existing_styles.map((style) => ({
          id: styleIdsMap[style.id]!,
          name: style.name,
        })),
      });

      const breweryIdsMap = existing_breweries.reduce<Record<string, string>>(
        (acc, brewery) => {
          acc[`${brewery.id}`] = nanoid();
          return acc;
        },
        {},
      );

      await tx.breweries.createMany({
        data: existing_breweries.map((brewery) => ({
          id: breweryIdsMap[brewery.id]!,
          slug: slugify(breweryIdsMap[brewery.id]!, brewery.name),
          name: brewery.name,
          countryAlpha2Code: brewery.country_alpha_2_code,
          createdAt: new Date(brewery.created_at),
          createdBy: userIdsMap[brewery.created_by]!,
          updatedAt: new Date(brewery.created_at),
          updatedBy: userIdsMap[brewery.created_by]!,
        })),
      });

      const beerIdsMap = existing_beers.reduce<Record<string, string>>(
        (acc, val) => {
          acc[`${val.id}`] = nanoid();
          return acc;
        },
        {},
      );

      await tx.beers.createMany({
        data: existing_beers.map((beer) => ({
          id: beerIdsMap[`${beer.id}`]!,
          name: beer.name,
          slug: slugify(beerIdsMap[`${beer.id}`]!, beer.name),
          abv: Number(beer.abv),
          ibu: beer.ibu ? Number(beer.ibu) : null,
          breweryId: breweryIdsMap[beer.brewery]!,
          styleId: styleIdsMap[beer.style]!,
          colorId: beer.color ? colorIdsMap[beer.color]! : otherColorId,
          createdAt: new Date(beer.creation_time),
          createdBy: userIdsMap[beer.added_by]!,
          updatedAt: new Date(beer.creation_time),
          updatedBy: userIdsMap[beer.added_by]!,
        })),
      });

      await tx.reviews.createMany({
        data: existing_reviews.map((review) => {
          const id = nanoid();

          return {
            id,
            slug: slugify(id, beerIdsMap[review.beer]!),

            globalScore: Number(review.score),
            servingFrom: ServingFrom.UNKNOWN,
            comment: review.comment,
            userId: userIdsMap[review.user]!,
            beerId: beerIdsMap[review.beer]!,
            createdAt: new Date(review.date),
            updatedAt: new Date(review.date),
          };
        }),
      });
    },
    {
      timeout: 60_000,
    },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
