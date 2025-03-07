import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import ReviewForm from "@/app/[locale]/(forms)/(review)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/form";
import ReviewFormHeader from "@/app/[locale]/(forms)/(review)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/header";
import { getBeerBySlug } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface ReviewPageProps {
  params: Promise<{
    brewerySlug: string;
    beerSlug: string;
  }>;
}

const ReviewPage = async ({ params }: ReviewPageProps) => {
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

  return (
    <div className="@container flex size-full min-h-screen items-center justify-center">
      <div
        className={cn(
          "flex w-fit flex-col gap-y-8",
          "w-full @3xl:w-192 @3xl:pt-8",
        )}
      >
        <ReviewFormHeader beer={beer} />

        <div className={cn("p-8 @4xl:px-0")}>
          <ReviewForm beerId={beer.id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
