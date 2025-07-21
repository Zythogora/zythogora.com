import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BreweryReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-review-card";
import Await from "@/app/_components/await";
import ReviewPictureGrid from "@/app/_components/review-picture-grid";
import ReviewPictureGridLoader from "@/app/_components/review-picture-grid/loader";
import { ChipTabContent } from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import { getBreweryFriendReviewsForUser } from "@/domain/breweries";
import { getLatestBreweryFriendPictures } from "@/domain/breweries";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BreweryFriendReviewsProps {
  brewerySlug: string;
  page: number;
}

const BreweryFriendReviews = async ({
  brewerySlug,
  page,
}: BreweryFriendReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <ChipTabContent value="friend-reviews" className="flex flex-col gap-y-4">
        <p>
          {t.rich("breweryPage.tabs.reviews.content.tabs.friendReviews.login", {
            link: (chunks) => (
              <Link
                href={Routes.SIGN_IN}
                className="text-primary-700 underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </ChipTabContent>
    );
  }

  const latestFriendPicturesPromise = getLatestBreweryFriendPictures({
    userId: user.id,
    brewerySlug,
  });

  const friendReviewsPromise = getBreweryFriendReviewsForUser({
    userId: user.id,
    brewerySlug,
    page,
  });

  return (
    <ChipTabContent value="friend-reviews" className="flex flex-col gap-y-4">
      <Suspense
        key={`${brewerySlug}-friend-pictures`}
        fallback={<ReviewPictureGridLoader />}
      >
        <Await promise={latestFriendPicturesPromise}>
          {(pictures) => <ReviewPictureGrid pictures={pictures} />}
        </Await>
      </Suspense>

      <Suspense
        key={`${brewerySlug}-friend-reviews-${page}`}
        fallback={
          <p>
            {t("breweryPage.tabs.reviews.content.tabs.friendReviews.loading")}
          </p>
        }
      >
        <Await promise={friendReviewsPromise}>
          {(reviews) => (
            <>
              <p>
                {t.rich(
                  "breweryPage.tabs.reviews.content.tabs.friendReviews.count",
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

export default BreweryFriendReviews;
