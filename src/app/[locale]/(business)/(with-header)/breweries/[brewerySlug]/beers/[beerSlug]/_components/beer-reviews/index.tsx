import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import BeerReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/review-card";
import Await from "@/app/_components/await";
import {
  ChipTabContent,
  ChipTabList,
  ChipTabs,
  ChipTabTrigger,
} from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import {
  getBeerFriendReviewsForUser,
  getBeerReviewsByUser,
} from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BeerReviewsProps {
  beerId: string;
  page: number;
}

const BeerReviews = async ({ beerId, page }: BeerReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <p>
        {t.rich("beerPage.reviews.login", {
          link: (chunks) => (
            <Link href={Routes.SIGN_IN} className="text-primary-700 underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    );
  }

  const yourReviews = await getBeerReviewsByUser({
    userId: user.id,
    beerId,
    page,
  });

  const friendReviewsPromise = getBeerFriendReviewsForUser({
    userId: user.id,
    beerId,
    page,
  });

  return (
    <ChipTabs defaultValue="my-reviews">
      <ChipTabList>
        <ChipTabTrigger value="my-reviews">
          {t("beerPage.reviews.tabs.myReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="friend-reviews">
          {t("beerPage.reviews.tabs.friendReviews.title")}
        </ChipTabTrigger>
      </ChipTabList>

      <ChipTabContent value="my-reviews" className="flex flex-col gap-y-4">
        <p>
          {t.rich("beerPage.reviews.tabs.myReviews.count", {
            count: yourReviews.count,
            muted: (chunks) => (
              <span className="text-foreground/62.5 italic">{chunks}</span>
            ),
          })}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8">
          {yourReviews.results.map((review) => (
            <BeerReviewCard key={review.id} review={review} />
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
    </ChipTabs>
  );
};

export default BeerReviews;
