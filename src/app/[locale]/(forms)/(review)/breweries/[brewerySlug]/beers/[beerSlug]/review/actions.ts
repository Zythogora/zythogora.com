"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { reviewSchema } from "@/app/[locale]/(forms)/(review)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { reviewBeer } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const reviewAction = async (
  previousState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: Routes.SIGN_IN, locale });
  }

  const submission = parseWithZod(formData, {
    schema: reviewSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  const { beerId, ...review } = submission.value;

  const createdReview = await reviewBeer(beerId, review);

  redirect({
    href: generatePath(Routes.BEER, {
      brewerySlug: createdReview.beer.brewery.slug,
      beerSlug: createdReview.beer.slug,
    }),
    locale,
  });
};
