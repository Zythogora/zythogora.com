import { getTranslations } from "next-intl/server";

import BeerAllReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/beer-all-reviews";
import BeerFriendReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/beer-friend-reviews";
import BeerYourReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews/beer-your-reviews";
import {
  ChipTabList,
  ChipTabs,
  ChipTabTrigger,
} from "@/app/_components/ui/chip-tabs";
import { getCurrentUser } from "@/lib/auth";

interface BeerReviewsProps {
  beerId: string;
  page: number;
}

const BeerReviews = async ({ beerId, page }: BeerReviewsProps) => {
  const t = await getTranslations();

  const user = await getCurrentUser();

  return (
    <ChipTabs defaultValue={user ? "my-reviews" : "all-reviews"}>
      <ChipTabList>
        <ChipTabTrigger value="my-reviews">
          {t("beerPage.reviews.tabs.myReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="friend-reviews">
          {t("beerPage.reviews.tabs.friendReviews.title")}
        </ChipTabTrigger>

        <ChipTabTrigger value="all-reviews">
          {t("beerPage.reviews.tabs.allReviews.title")}
        </ChipTabTrigger>
      </ChipTabList>

      <BeerYourReviews beerId={beerId} page={page} />

      <BeerFriendReviews beerId={beerId} page={page} />

      <BeerAllReviews beerId={beerId} page={page} />
    </ChipTabs>
  );
};

export default BeerReviews;
