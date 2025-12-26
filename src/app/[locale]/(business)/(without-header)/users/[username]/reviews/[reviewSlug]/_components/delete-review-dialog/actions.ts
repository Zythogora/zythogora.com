"use server";

import { deleteReview, getReviewById } from "@/domain/reviews";
import { getCurrentUser } from "@/lib/auth";

import type { ActionResult } from "@/lib/action/types";

export const deleteReviewAction = async (
  reviewId: string,
): Promise<ActionResult<void>> => {
  const [user, review] = await Promise.all([
    getCurrentUser(),
    getReviewById(reviewId),
  ]);

  if (!review) {
    return {
      success: false,
      translationKey: "reviewPage.actions.remove.errors.removeNotFound",
    };
  }

  if (!user) {
    return { success: false, translationKey: "common.errors.unauthorized" };
  }

  if (review.userId !== user.id) {
    return { success: false, translationKey: "common.errors.forbidden" };
  }

  try {
    await deleteReview(reviewId);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      translationKey: "reviewPage.actions.remove.errors.removeUnknown",
    };
  }

  return { success: true };
};
