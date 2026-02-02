import { notFound } from "next/navigation";

import ReviewForm from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/form";
import ReviewFormHeader from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/header";
import { reviewPageSearchParamsSchema } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { getBeerBySlug } from "@/domain/beers";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

const ReviewPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]/review">) => {
  const { beerSlug, brewerySlug, locale } = await params;

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

  const searchParamsResult = reviewPageSearchParamsSchema.safeParse(
    await searchParams,
  );

  const prefill = searchParamsResult.success ? searchParamsResult.data : {};

  return (
    <div className="@container flex size-full min-h-screen items-center justify-center">
      <div
        className={cn(
          "flex w-fit flex-col gap-y-8",
          "w-full @3xl:w-3xl @3xl:pt-8",
        )}
      >
        <ReviewFormHeader beer={beer} />

        <div className={cn("p-8 @4xl:px-0")}>
          <ReviewForm
            beerId={beer.id}
            cellarItemId={prefill.fromCellar}
            defaultServingFrom={prefill.servingFrom}
            defaultBestBeforeDate={prefill.bestBefore}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
