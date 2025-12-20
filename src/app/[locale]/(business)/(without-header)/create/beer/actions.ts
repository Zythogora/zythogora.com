"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { getLocale } from "next-intl/server";

import { createBeer } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import { createBeerSchema } from "./schemas";

export const createBeerAction = async (
  pathname: string,
  prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: { redirect: pathname },
      },
      locale,
    });
  }

  const submission = parseWithZod(formData, {
    schema: createBeerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  const beer = await createBeer(submission.value);

  redirect({
    href: generatePath(Routes.BEER, {
      brewerySlug: beer.brewery.slug,
      beerSlug: beer.slug,
    }),
    locale,
  });
};
