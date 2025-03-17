import { getTranslations } from "next-intl/server";

import BreweryReviewCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-review-list/brewery-review-card";
import Pagination from "@/app/_components/ui/pagination";
import { getBreweryReviewsByUser } from "@/domain/breweries";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface BreweryReviewListProps {
  brewerySlug: string;
  page: number;
}

const BreweryReviewList = async ({
  brewerySlug,
  page,
}: BreweryReviewListProps) => {
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

  const breweryReviews = await getBreweryReviewsByUser({
    userId: user.id,
    brewerySlug,
    page,
  });

  return (
    <div className="flex flex-col gap-y-4">
      <p>
        {t("breweryPage.tabs.reviews.content.count", {
          count: breweryReviews.count,
        })}
      </p>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8">
        {breweryReviews.results.map((review) => (
          <BreweryReviewCard key={review.id} review={review} />
        ))}

        <Pagination
          current={breweryReviews.page.current}
          total={breweryReviews.page.total}
          className="col-span-2"
        />
      </div>
    </div>
  );
};

export default BreweryReviewList;
