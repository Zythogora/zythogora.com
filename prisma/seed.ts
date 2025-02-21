import { Prisma, PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

import { existing_beers } from "prisma/existing-data/beers";
import { existing_breweries } from "prisma/existing-data/breweries";
import { existing_colors } from "prisma/existing-data/colors";
import { existing_styles } from "prisma/existing-data/styles";

const prisma = new PrismaClient();

const slugify = (id: string, name: string) =>
  [
    id
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase(),
    name
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .slice(0, 60)
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase(),
  ].join("-");

async function main() {
  await prisma.$transaction(
    async (tx) => {
      const seedingUserId = (
        (await tx.betterAuthUsers.findUnique({
          where: {
            email: "seeding@zythogora.com",
          },
        })) ??
        (await tx.betterAuthUsers.create({
          data: {
            id: nanoid(),
            name: "SEEDING_USER",
            email: "seeding@zythogora.com",
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }))
      ).id;

      await tx.users.upsert({
        where: { id: seedingUserId },
        update: {},
        create: {
          id: seedingUserId,
          username: "SEEDING_USER",
        },
      });

      await tx.$executeRaw`ALTER TABLE "beer_data"."colors" ADD COLUMN "previous_id" SMALLINT;`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."colors" ADD CONSTRAINT "colors_hex_key" UNIQUE ("hex");`;

      await tx.$executeRaw`ALTER TABLE "beer_data"."styles" ADD COLUMN "previous_id" SMALLINT;`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."styles" ADD CONSTRAINT "styles_name_key" UNIQUE ("name");`;

      await tx.$executeRaw`ALTER TABLE "beer_data"."breweries" ADD COLUMN "previous_id" SMALLINT;`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."breweries" ADD CONSTRAINT "breweries_name_key" UNIQUE ("name");`;

      await tx.$executeRaw`
        INSERT INTO "beer_data"."colors" ("id", "previous_id", "name", "hex", "srm_min", "srm_max")
        VALUES ${Prisma.join(
          existing_colors.map(
            (color) =>
              Prisma.sql`(${nanoid()}, ${Number(color.id)}, ${color.name}, ${color.color}, 0, 0)`,
          ),
        )}
        ON CONFLICT (hex) DO UPDATE SET previous_id = EXCLUDED.previous_id;
      `;

      const colors =
        (await tx.$queryRaw`SELECT * FROM "beer_data"."colors";`) as {
          id: string;
          name: string;
          previous_id: number;
        }[];

      const colorIdsMap = colors.reduce<Record<string, string>>((acc, val) => {
        acc[`${val.previous_id}`] = val.id;
        return acc;
      }, {});

      // other color
      let otherColorId = colors.find((c) => c.name === "Other")?.id;
      if (!otherColorId) {
        otherColorId = (
          await tx.colors.create({
            data: {
              name: "Other",
              hex: "ffffff",
              srmMin: 0,
              srmMax: 40,
            },
          })
        ).id;
      }

      await tx.$executeRaw`
      INSERT INTO "beer_data"."styles" ("id", "previous_id", "name")
      VALUES ${Prisma.join(
        existing_styles.map(
          (style) =>
            Prisma.sql`(${nanoid()}, ${Number(style.id)}, ${style.name})`,
        ),
      )}
      ON CONFLICT (name) DO UPDATE SET previous_id = EXCLUDED.previous_id;
    `;

      const styles =
        (await tx.$queryRaw`SELECT * FROM "beer_data"."styles";`) as {
          id: string;
          previous_id: number;
        }[];

      const styleIdsMap = styles.reduce<Record<string, string>>((acc, val) => {
        acc[`${val.previous_id}`] = val.id;
        return acc;
      }, {});

      const breweryIdsMap = existing_breweries.reduce<Record<string, string>>(
        (acc, brewery) => {
          acc[`${brewery.id}`] = nanoid();
          return acc;
        },
        {},
      );

      await tx.$executeRaw`
      INSERT INTO "beer_data"."breweries" ("id", "slug", "previous_id", "name", "country_alpha_2_code", "created_at", "created_by", "updated_at", "updated_by")
      VALUES ${Prisma.join(
        existing_breweries.map(
          (brewery) =>
            Prisma.sql`(${breweryIdsMap[brewery.id]!}, ${slugify(breweryIdsMap[brewery.id]!, brewery.name)}, ${Number(brewery.id)}, ${brewery.name}, ${brewery.country_alpha_2_code}, ${new Date(brewery.created_at)}, ${seedingUserId}, ${new Date(brewery.created_at)}, ${seedingUserId})`,
        ),
      )}
      ON CONFLICT (name) DO UPDATE SET previous_id = EXCLUDED.previous_id;
    `;

      const beersAvailable = await tx.beers.findMany();

      const beersToInsert = existing_beers.filter(
        (beer) =>
          !beersAvailable.some(
            (b) =>
              b.name === beer.name &&
              b.breweryId === breweryIdsMap[beer.brewery],
          ),
      );

      console.log(`New beers to insert: ${beersToInsert.length}`);

      await tx.beers.createMany({
        data: beersToInsert.map((beer) => {
          const id = nanoid();

          return {
            id,
            name: beer.name,
            slug: slugify(id, beer.name),
            abv: Number(beer.abv),
            ibu: beer.ibu ? Number(beer.ibu) : null,
            breweryId: breweryIdsMap[beer.brewery]!,
            styleId: styleIdsMap[beer.style]!,
            colorId: beer.color ? colorIdsMap[beer.color]! : otherColorId,
            createdAt: new Date(beer.created_at),
            createdBy: seedingUserId,
            updatedAt: new Date(beer.created_at),
            updatedBy: seedingUserId,
          };
        }),
      });

      await tx.$executeRaw`ALTER TABLE "beer_data"."breweries" DROP CONSTRAINT "breweries_name_key";`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."breweries" DROP COLUMN "previous_id";`;

      await tx.$executeRaw`ALTER TABLE "beer_data"."styles" DROP CONSTRAINT "styles_name_key";`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."styles" DROP COLUMN "previous_id";`;

      await tx.$executeRaw`ALTER TABLE "beer_data"."colors" DROP CONSTRAINT "colors_hex_key";`;
      await tx.$executeRaw`ALTER TABLE "beer_data"."colors" DROP COLUMN "previous_id";`;
    },
    {
      timeout: 60_0000,
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
