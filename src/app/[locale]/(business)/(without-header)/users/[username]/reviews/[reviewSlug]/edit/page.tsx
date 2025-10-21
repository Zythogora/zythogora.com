import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { editReviewAction } from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/edit/actions";
import ReviewPageContent from "@/app/_components/review-form";
import { getReviewByUsernameAndSlug } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";

interface ReviewPageProps {
  params: Promise<{
    username: string;
    reviewSlug: string;
  }>;
}

const ReviewPage = async ({ params }: ReviewPageProps) => {
  const locale = await getLocale();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  const user = await getCurrentUser();
  // if (!user) {
  //   redirect({
  //     href: {
  //       pathname: Routes.SIGN_IN,
  //       query: {
  //         redirect: generatePath(Routes.REVIEW_FORM, {
  //           brewerySlug,
  //           beerSlug,
  //         }),
  //       },
  //     },
  //     locale,
  //   });
  // }

  return (
    <ReviewPageContent
      beer={review.beer}
      reviewAction={editReviewAction}
      defaultValue={{
        ...review,
        // When editing a legacy review, the servingFrom was set to UNKNOWN
        // Therefore, to provide a valid value, we set it to DRAFT by default
        servingFrom:
          review.servingFrom === "UNKNOWN" ? "DRAFT" : review.servingFrom,
      }}
      existingReviewParams={{
        username,
        reviewSlug,
      }}
    />
  );
};

export default ReviewPage;
