import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { PurchaseType } from "@db/enums";

import { editReviewAction } from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/edit/actions";
import ReviewPageContent from "@/app/_components/review-form";
import { getReviewByUsernameAndSlug } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

const ReviewPage = async ({
  params,
}: PageProps<"/[locale]/users/[username]/reviews/[reviewSlug]/edit">) => {
  const locale = await getLocale();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  const user = await getCurrentUser();

  if (!user) {
    return redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: {
          redirect: generatePath(Routes.EDIT_REVIEW, {
            username,
            reviewSlug,
          }),
        },
      },
      locale,
    });
  }

  if (user.id !== review.user.id) {
    return redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: {
          redirect: generatePath(Routes.REVIEW, {
            username,
            reviewSlug,
          }),
        },
      },
      locale,
    });
  }

  const purchaseTypeFields = review.purchaseLocation
    ? review.purchaseLocation.type === PurchaseType.PHYSICAL_LOCATION
      ? {
          purchaseType: PurchaseType.PHYSICAL_LOCATION,
          purchaseLocationId: review.purchaseLocation.id,
          purchaseLocationLabel: review.purchaseLocation.description,
        }
      : {
          purchaseType: PurchaseType.ONLINE,
          purchaseStoreUrl: review.purchaseLocation.description,
        }
    : {};

  return (
    <ReviewPageContent
      beer={review.beer}
      reviewAction={editReviewAction}
      defaultValue={{
        ...review,
        reviewId: review.id,
        // When editing a legacy review, the servingFrom was set to UNKNOWN
        // Therefore, to provide a valid value, we set it to DRAFT by default
        servingFrom:
          review.servingFrom === "UNKNOWN" ? "DRAFT" : review.servingFrom,
        ...purchaseTypeFields,
      }}
      existingReviewParams={{
        username,
        reviewSlug,
      }}
    />
  );
};

export default ReviewPage;
