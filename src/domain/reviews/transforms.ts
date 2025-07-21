import type { RawBeerReview } from "@/domain/beers/types";
import type { ReviewWithPicture } from "@/domain/reviews/types";

export const transformRawBeerReviewToBeerReviewWithPicture = (
  rawReview: RawBeerReview,
): ReviewWithPicture => {
  if (!rawReview.pictureUrl) {
    throw new Error("Picture URL is required");
  }

  return {
    id: rawReview.id,
    slug: rawReview.slug,
    pictureUrl: rawReview.pictureUrl,
    username: rawReview.user.username,
  };
};
