"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { getLocale } from "next-intl/server";

import { reviewSchema } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { reviewBeer } from "@/domain/beers";
import {
  ExplicitContentCheckError,
  ExplicitContentError,
  FileUploadError,
  ImageOptimizationError,
} from "@/domain/beers/errors";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const publishReviewAction = async (
  pathname: string,
  previousState: unknown,
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
    schema: reviewSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  const { beerId, ...review } = submission.value;

  let createdReview;

  try {
    createdReview = await reviewBeer(beerId, review);
  } catch (error) {
    if (error instanceof ExplicitContentCheckError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["createReviewPage.errors.EXPLICIT_CONTENT_CHECK"],
        },
      });
    }

    if (error instanceof ExplicitContentError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["createReviewPage.errors.EXPLICIT_CONTENT"],
        },
      });
    }

    if (error instanceof ImageOptimizationError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["createReviewPage.errors.IMAGE_OPTIMIZATION"],
        },
      });
    }

    if (error instanceof FileUploadError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["createReviewPage.errors.FILE_UPLOAD"],
        },
      });
    }

    console.error(error);
    return submission.reply({
      resetForm: false,
      formErrors: ["createReviewPage.errors.SOMETHING_WENT_WRONG"],
    });
  }

  redirect({
    href: generatePath(Routes.BEER, {
      brewerySlug: createdReview.beer.brewery.slug,
      beerSlug: createdReview.beer.slug,
    }),
    locale,
  });
};
