import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { publishReviewAction } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/actions";
import ReviewPageContent from "@/app/_components/review-form";
import { getBeerBySlug } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

const ReviewPage = async ({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]/review">) => {
  const locale = await getLocale();

  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  if (beer.brewery.slug !== brewerySlug || beer.slug !== beerSlug) {
    redirect({
      href: generatePath(Routes.REVIEW_FORM, {
        brewerySlug: beer.brewery.slug,
        beerSlug: beer.slug,
      }),
      locale,
    });
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: {
          redirect: generatePath(Routes.REVIEW_FORM, {
            brewerySlug,
            beerSlug,
          }),
        },
      },
      locale,
    });
  }

  return <ReviewPageContent beer={beer} reviewAction={publishReviewAction} />;
};

export default ReviewPage;
