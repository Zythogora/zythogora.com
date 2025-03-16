import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

import { new_styles } from "./data/styles";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const styleCategories = new_styles.reduce<string[]>((acc, category) => {
      if (!acc.includes(category.category)) {
        acc.push(category.category);
      }
      return acc;
    }, []);

    const styleCategoriesIdsMap = styleCategories.reduce<
      Record<string, string>
    >((acc, category) => {
      acc[`${category}`] = nanoid();
      return acc;
    }, {});

    await tx.styleCategories.createMany({
      data: styleCategories.map((category) => ({
        id: styleCategoriesIdsMap[category]!,
        name: category,
      })),
      skipDuplicates: true,
    });

    await tx.styles.createMany({
      data: new_styles.map((style) => ({
        categoryId: styleCategoriesIdsMap[style.category]!,
        name: style.style,
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
