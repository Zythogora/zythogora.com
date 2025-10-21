import type { ReviewActionData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import ReviewForm from "@/app/_components/review-form/form";
import ReviewFormHeader from "@/app/_components/review-form/header";
import type { Beer } from "@/domain/beers/types";
import { cn } from "@/lib/tailwind";

import type { SubmissionResult } from "@conform-to/react";

interface ReviewPageContentProps {
  beer: Beer;
  reviewAction: (
    pathname: string,
    previousState: unknown,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]> | undefined>;
  defaultValue?: Omit<ReviewActionData, "picture"> & { pictureUrl?: string };
  existingReviewParams?: {
    username: string;
    reviewSlug: string;
  };
}

const ReviewPageContent = ({
  beer,
  reviewAction,
  defaultValue,
  existingReviewParams,
}: ReviewPageContentProps) => {
  return (
    <div className="@container flex size-full min-h-screen items-center justify-center">
      <div
        className={cn(
          "flex w-fit flex-col gap-y-8",
          "w-full @3xl:w-3xl @3xl:pt-8",
        )}
      >
        <ReviewFormHeader beer={beer} />

        <div className={cn("p-8 @4xl:px-0")}>
          <ReviewForm
            beerId={beer.id}
            reviewAction={reviewAction}
            defaultValue={defaultValue}
            existingReviewParams={existingReviewParams}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPageContent;
