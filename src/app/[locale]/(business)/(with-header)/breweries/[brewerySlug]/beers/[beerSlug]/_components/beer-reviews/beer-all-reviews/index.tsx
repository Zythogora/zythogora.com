import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/review-card";
import Await from "@/app/_components/await";
import ReviewPictureGrid from "@/app/_components/review-picture-grid";
import ReviewPictureGridLoader from "@/app/_components/review-picture-grid/loader";
import { ChipTabContent } from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import { getAllBeerReviews } from "@/domain/beers";
import { getLatestPublicPictures } from "@/domain/beers";

interface BeerAllReviewsProps {
  beerId: string;
  page: number;
}

const BeerAllReviews = async ({ beerId, page }: BeerAllReviewsProps) => {
  const t = await getTranslations();

  const latestPicturesPromise = getLatestPublicPictures({ beerId });

  const allReviewsPromise = getAllBeerReviews({
    beerId,
    page,
  });

  return (
    <ChipTabContent value="all-reviews" className="flex flex-col gap-y-4">
      <Suspense
        key={`${beerId}-all-pictures`}
        fallback={<ReviewPictureGridLoader />}
      >
        <Await promise={latestPicturesPromise}>
          {(pictures) => <ReviewPictureGrid pictures={pictures} />}
        </Await>
      </Suspense>

      <Suspense
        key={`${beerId}-all-reviews-${page}`}
        fallback={<p>{t("beerPage.reviews.tabs.allReviews.loading")}</p>}
      >
        <Await promise={allReviewsPromise}>
          {(reviews) => (
            <>
              <p>
                {t.rich("beerPage.reviews.tabs.allReviews.count", {
                  count: reviews.count,
                  muted: (chunks) => (
                    <span className="text-foreground/62.5 italic">
                      {chunks}
                    </span>
                  ),
                })}
              </p>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8">
                {reviews.results.map((review) => (
                  <BeerReviewCard key={review.id} review={review} />
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

export default BeerAllReviews;
