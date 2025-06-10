import { getTranslations } from "next-intl/server";

import BreweryAllReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-all-reviews";
import BreweryFriendReviewsList from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-friend-reviews";
import BreweryYourReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews/brewery-your-reviews";
import {
  ChipTabs,
  ChipTabList,
  ChipTabTrigger,
} from "@/app/_components/ui/chip-tabs";
import { getCurrentUser } from "@/lib/auth";

interface BreweryReviewsProps {
  brewerySlug: string;
  page: number;
}

const BreweryReviews = async ({ brewerySlug, page }: BreweryReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  return (
    <ChipTabs defaultValue={user ? "my-reviews" : "all-reviews"}>
      <ChipTabList>
        <ChipTabTrigger value="my-reviews">
          {t("breweryPage.tabs.reviews.content.tabs.myReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="friend-reviews">
          {t("breweryPage.tabs.reviews.content.tabs.friendReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="all-reviews">
          {t("breweryPage.tabs.reviews.content.tabs.allReviews.title")}
        </ChipTabTrigger>
      </ChipTabList>

      <BreweryYourReviews brewerySlug={brewerySlug} page={page} />

      <BreweryFriendReviewsList brewerySlug={brewerySlug} page={page} />

      <BreweryAllReviews brewerySlug={brewerySlug} page={page} />
    </ChipTabs>
  );
};

export default BreweryReviews;
