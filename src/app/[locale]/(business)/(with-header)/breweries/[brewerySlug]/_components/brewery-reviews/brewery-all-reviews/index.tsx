import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BreweryReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-review-card";
import Await from "@/app/_components/await";
import ReviewPictureGrid from "@/app/_components/review-picture-grid";
import ReviewPictureGridLoader from "@/app/_components/review-picture-grid/loader";
import { ChipTabContent } from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import { getAllBreweryReviews } from "@/domain/breweries";
import { getLatestBreweryPublicPictures } from "@/domain/breweries";

interface BreweryAllReviewsProps {
  brewerySlug: string;
  page: number;
}

const BreweryAllReviews = async ({
  brewerySlug,
  page,
}: BreweryAllReviewsProps) => {
  const t = await getTranslations();

  const latestPicturesPromise = getLatestBreweryPublicPictures({ brewerySlug });

  const allReviewsPromise = getAllBreweryReviews({
    brewerySlug,
    page,
  });

  return (
    <ChipTabContent value="all-reviews" className="flex flex-col gap-y-4">
      <Suspense
        key={`${brewerySlug}-all-pictures`}
        fallback={<ReviewPictureGridLoader />}
      >
        <Await promise={latestPicturesPromise}>
          {(pictures) => <ReviewPictureGrid pictures={pictures} />}
        </Await>
      </Suspense>

      <Suspense
        key={`${brewerySlug}-all-reviews-${page}`}
        fallback={
          <p>{t("breweryPage.tabs.reviews.content.tabs.allReviews.loading")}</p>
        }
      >
        <Await promise={allReviewsPromise}>
          {(reviews) => (
            <>
              <p>
                {t.rich(
                  "breweryPage.tabs.reviews.content.tabs.allReviews.count",
                  {
                    count: reviews.count,
                    muted: (chunks) => (
                      <span className="text-foreground/62.5 italic">
                        {chunks}
                      </span>
                    ),
                  },
                )}
              </p>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8">
                {reviews.results.map((review) => (
                  <BreweryReviewCard key={review.id} review={review} />
                ))}

                <Pagination
                  current={reviews.page.current}
                  total={reviews.page.total}
                  className="col-span-2"
                />
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </ChipTabContent>
  );
};

export default BreweryAllReviews;
