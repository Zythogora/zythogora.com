import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

import { bjcp_categories, bjcp_styles } from "prisma/seeding/new/data/bjcp";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const styleCategoriesIdsMap = bjcp_categories.reduce<
      Record<string, string>
    >((acc, category) => {
      acc[`${category.bjcp_id}`] = nanoid();
      return acc;
    }, {});

    await tx.styleCategories.createMany({
      data: bjcp_categories.map((category) => ({
        id: styleCategoriesIdsMap[category.bjcp_id]!,
        name: category.name,
      })),
      skipDuplicates: true,
    });

    await tx.styles.createMany({
      data: bjcp_styles.map((style) => ({
        id: nanoid(),
        categoryId: styleCategoriesIdsMap[style.bjcp_category_id]!,
        name: style.name,
      })),
      skipDuplicates: true,
    });
  });
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
