import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BreweryFriendReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-friend-review-card";
import BreweryYourReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-your-review-card";
import Await from "@/app/_components/await";
import {
  ChipTabs,
  ChipTabList,
  ChipTabTrigger,
  ChipTabContent,
} from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import {
  getBreweryFriendReviewsForUser,
  getBreweryReviewsByUser,
} from "@/domain/breweries";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BreweryReviewsProps {
  brewerySlug: string;
  page: number;
}

const BreweryReviews = async ({ brewerySlug, page }: BreweryReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <p>
        {t.rich("breweryPage.tabs.reviews.content.login", {
          link: (chunks) => (
            <Link href={Routes.SIGN_IN} className="text-primary-700 underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    );
  }

  const yourReviews = await getBreweryReviewsByUser({
    userId: user.id,
    brewerySlug,
    page,
  });

  const friendReviewsPromise = getBreweryFriendReviewsForUser({
    userId: user.id,
    brewerySlug,
    page,
  });

  return (
    <ChipTabs defaultValue="my-reviews">
      <ChipTabList>
        <ChipTabTrigger value="my-reviews">
          {t("breweryPage.tabs.reviews.content.tabs.myReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="friend-reviews">
          {t("breweryPage.tabs.reviews.content.tabs.friendReviews.title")}
        </ChipTabTrigger>
      </ChipTabList>

      <ChipTabContent value="my-reviews" className="flex flex-col gap-y-4">
        <p>
          {t.rich("breweryPage.tabs.reviews.content.tabs.myReviews.count", {
            count: yourReviews.count,
            muted: (chunks) => (
              <span className="text-foreground/62.5 italic">{chunks}</span>
            ),
          })}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8">
          {yourReviews.results.map((review) => (
            <BreweryYourReviewCard key={review.id} review={review} />
          ))}

          <Pagination
            current={yourReviews.page.current}
            total={yourReviews.page.total}
            className="col-span-2"
          />
        </div>
      </ChipTabContent>

      <ChipTabContent value="friend-reviews" className="flex flex-col gap-y-4">
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
                    <BreweryFriendReviewCard key={review.id} review={review} />
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
    </ChipTabs>
  );
};

export default BreweryReviews;
