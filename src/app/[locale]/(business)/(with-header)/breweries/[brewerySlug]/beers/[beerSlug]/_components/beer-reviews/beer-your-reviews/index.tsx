import { getTranslations } from "next-intl/server";

import BeerReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/review-card";
import { ChipTabContent } from "@/app/_components/ui/chip-tabs";
import Pagination from "@/app/_components/ui/pagination";
import { getBeerReviewsByUser } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BeerYourReviewsProps {
  beerId: string;
  page: number;
}

const BeerYourReviews = async ({ beerId, page }: BeerYourReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <ChipTabContent value="my-reviews" className="flex flex-col gap-y-4">
        <p>
          {t.rich("beerPage.reviews.tabs.myReviews.login", {
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

  const yourReviews = await getBeerReviewsByUser({
    userId: user.id,
    beerId,
    page,
  });

  return (
    <ChipTabContent value="my-reviews" className="flex flex-col gap-y-4">
      <>
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
      </>
    </ChipTabContent>
  );
};

export default BeerYourReviews;
