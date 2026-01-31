"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { getLocale } from "next-intl/server";

import { reviewSchema } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import {
  ExplicitContentCheckError,
  ExplicitContentError,
  FileUploadError,
  ImageOptimizationError,
  UnknownPurchaseLocationError,
} from "@/domain/beers/errors";
import { updateReview } from "@/domain/reviews";
import {
  ForbiddenReviewEditError,
  UnknownReviewError,
} from "@/domain/users/errors";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const editReviewAction = async (
  pathname: string,
  previousState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: { pathname: Routes.SIGN_IN, query: { redirect: pathname } },
      locale,
    });
  }

  const submission = parseWithZod(formData, { schema: reviewSchema });

  if (submission.status !== "success") {
    return submission.reply({ resetForm: false });
  }

  let updatedReview;

  try {
    updatedReview = await updateReview(submission.value);
  } catch (error) {
    if (error instanceof ExplicitContentCheckError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["editReviewPage.errors.EXPLICIT_CONTENT_CHECK"],
        },
      });
    }

    if (error instanceof ExplicitContentError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["editReviewPage.errors.EXPLICIT_CONTENT"],
        },
      });
    }

    if (error instanceof ImageOptimizationError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["editReviewPage.errors.IMAGE_OPTIMIZATION"],
        },
      });
    }

    if (error instanceof FileUploadError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          picture: ["editReviewPage.errors.FILE_UPLOAD"],
        },
      });
    }

    if (error instanceof UnknownPurchaseLocationError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          purchaseLocationId: [
            "editReviewPage.errors.UNKNOWN_PURCHASE_LOCATION",
          ],
        },
      });
    }

    if (error instanceof UnknownReviewError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["editReviewPage.errors.REVIEW_NOT_FOUND"],
      });
    }

    if (error instanceof ForbiddenReviewEditError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["editReviewPage.errors.FORBIDDEN"],
      });
    }

    console.error(error);
    return submission.reply({
      resetForm: false,
      formErrors: ["editReviewPage.errors.SOMETHING_WENT_WRONG"],
    });
  }

  redirect({
    href: generatePath(Routes.REVIEW, {
      username: updatedReview.user.username,
      reviewSlug: updatedReview.slug,
    }),
    locale,
  });
};
