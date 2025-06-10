import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/review-card";
import Await from "@/app/_components/await";
import { ChipTabContent } from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import { getBeerFriendReviewsForUser } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BeerFriendReviewsProps {
  beerId: string;
  page: number;
}

const BeerFriendReviews = async ({ beerId, page }: BeerFriendReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <ChipTabContent value="friend-reviews" className="flex flex-col gap-y-4">
        <p>
          {t.rich("beerPage.reviews.tabs.friendReviews.login", {
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

  const friendReviewsPromise = getBeerFriendReviewsForUser({
    userId: user.id,
    beerId,
    page,
  });

  return (
    <ChipTabContent value="friend-reviews" className="flex flex-col gap-y-4">
      <Suspense
        key={`${beerId}-friend-reviews-${page}`}
        fallback={<p>{t("beerPage.reviews.tabs.friendReviews.loading")}</p>}
      >
        <Await promise={friendReviewsPromise}>
          {(reviews) => (
            <>
              <p>
                {t.rich("beerPage.reviews.tabs.friendReviews.count", {
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

export default BeerFriendReviews;
