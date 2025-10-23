import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import BeerCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-card";
import BeerReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews";
import { beerPageSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/schemas";
import ShareButton from "@/app/_components/share-button";
import Button from "@/app/_components/ui/button";
import { getBeerBySlug } from "@/domain/beers";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { StaticGenerationMode } from "@/lib/config/types";
import { Link, redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";
import { exhaustiveCheck } from "@/lib/typescript/utils";

interface BeerPageProps {
  params: Promise<{
    brewerySlug: string;
    beerSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateStaticParams(): Promise<
  Awaited<BeerPageProps["params"]>[]
> {
  if (config.next.staticGeneration === StaticGenerationMode.NONE) {
    // There's a bug in Next.js that crashes dynamic routes when using
    // generateStaticParams and an empty array of params.
    // The workaround is to return a dummy value.
    return [{ brewerySlug: "-", beerSlug: "-" }];
  }

  const beers = await prisma.beers.findMany({
    include: { brewery: true },
  });

  const slugs = beers.map((beer) => ({
    brewerySlug: beer.brewery.slug,
    beerSlug: beer.slug,
  }));

  if (config.next.staticGeneration === StaticGenerationMode.SLUG_ONLY) {
    return slugs;
  }

  if (config.next.staticGeneration === StaticGenerationMode.ALL) {
    return slugs
      .map((slug) => [
        slug,
        {
          brewerySlug: slug.brewerySlug.slice(0, 4),
          beerSlug: slug.beerSlug.slice(0, 4),
        },
      ])
      .flat();
  }

  return exhaustiveCheck({
    value: config.next.staticGeneration,
    error: "Invalid static generation mode for the beer page params",
  });
}

export async function generateMetadata({ params }: BeerPageProps) {
  const t = await getTranslations();

  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  const title = `${beer.name} - ${beer.brewery.name} | ${publicConfig.appName}`;
  const description = t("beerPage.metadata.description", {
    beerName: beer.name,
    breweryName: beer.brewery.name,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: publicConfig.appName,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}

const BeerPage = async ({ params, searchParams }: BeerPageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const { brewerySlug, beerSlug } = await params;

  const searchParamsResult = beerPageSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return redirect({
      href: generatePath(Routes.BEER, {
        brewerySlug,
        beerSlug,
      }),
      locale,
    });
  }

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  if (beer.brewery.slug !== brewerySlug || beer.slug !== beerSlug) {
    redirect({
      href: `${generatePath(Routes.BEER, {
        brewerySlug: beer.brewery.slug,
        beerSlug: beer.slug,
      })}${
        searchParamsResult.data.page
          ? `?page=${searchParamsResult.data.page}`
          : ""
      }`,
      locale,
    });
  }

  return (
    <div className="flex w-full flex-col gap-y-12">
      <div className={cn("isolate flex flex-col", "gap-y-6 md:gap-y-2")}>
        <BeerCard
          name={beer.name}
          brewery={beer.brewery}
          abv={beer.abv}
          ibu={beer.ibu}
          style={beer.style}
          color={beer.color}
          description={beer.description}
          releaseYear={beer.releaseYear}
          className="md:rounded-t-xl md:rounded-b"
        />

        <div
          className={cn(
            "flex flex-row",
            "gap-x-2 px-10 py-4 md:gap-x-1 md:p-0",
          )}
        >
          <Button
            asChild
            className={cn(
              "grow",
              "md:rounded-t-md md:rounded-bl-[14px] md:before:rounded-t md:before:rounded-bl-xl",
            )}
          >
            <Link
              href={generatePath(Routes.REVIEW_FORM, {
                brewerySlug: beer.brewery.slug,
                beerSlug: beer.slug,
              })}
            >
              {t("beerPage.actions.review")}
            </Link>
          </Button>

          <ShareButton
            size="icon"
            variant="outline"
            label={t("beerPage.actions.share")}
            link={`${publicConfig.baseUrl}${generatePath(Routes.BEER, {
              brewerySlug: beer.brewery.slug.slice(0, 4),
              beerSlug: beer.slug.slice(0, 4),
            })}`}
            triggerClassName={cn(
              "shrink-0",
              "md:rounded-t-md md:rounded-br-[14px] md:before:rounded-t md:before:rounded-br-xl",
            )}
          />
        </div>
      </div>

      <div className="px-10 md:px-0">
        <BeerReviews beerId={beer.id} page={searchParamsResult.data.page} />
      </div>
    </div>
  );
};

export default BeerPage;
