import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BeerCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-card";
import BeerReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/_components/beer-reviews";
import { beerPageSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/beers/[beerSlug]/schemas";
import JsonLd from "@/app/_components/json-ld";
import ShareButton from "@/app/_components/share-button";
import Button from "@/app/_components/ui/button";
import {
  getAllBeerReviews,
  getBeerAggregateRatingById,
  getBeerBySlug,
} from "@/domain/beers";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { StaticGenerationMode } from "@/lib/config/types";
import { Link, redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl, getAlternates } from "@/lib/seo";
import { cn } from "@/lib/tailwind";
import { exhaustiveCheck } from "@/lib/typescript/utils";

import type { Metadata } from "next";
import type { Product as ProductJsonLd, WithContext } from "schema-dts";

export async function generateStaticParams(): Promise<
  Array<
    Omit<
      Awaited<
        PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]">["params"]
      >,
      "locale"
    >
  >
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

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]">): Promise<Metadata> {
  const { beerSlug, brewerySlug, locale } = await params;

  const t = await getTranslations({ locale });

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
    alternates: getAlternates(
      generatePath(Routes.BEER, {
        brewerySlug: beer.brewery.slug,
        beerSlug: beer.slug,
      }),
    ),
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

const BeerPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

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

  const [aggregateRating, latestReviews] = await Promise.all([
    getBeerAggregateRatingById(beer.id),
    getAllBeerReviews({ beerId: beer.id, limit: 5, page: 1 }),
  ]);

  return (
    <div className="flex w-full flex-col gap-y-12">
      <JsonLd
        data={
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": getAbsoluteUrl(
              generatePath(Routes.BEER, {
                brewerySlug: beer.brewery.slug,
                beerSlug: beer.slug,
              }),
            ),
            url: getAbsoluteUrl(
              generatePath(Routes.BEER, {
                brewerySlug: beer.brewery.slug,
                beerSlug: beer.slug,
              }),
            ),
            name: beer.name,
            ...(beer.description && { description: beer.description }),
            ...(aggregateRating.reviewCount ? { aggregateRating } : {}),
            brand: {
              "@type": "Brewery",
              "@id": getAbsoluteUrl(
                generatePath(Routes.BREWERY, {
                  brewerySlug: beer.brewery.slug,
                }),
              ),
              url: getAbsoluteUrl(
                generatePath(Routes.BREWERY, {
                  brewerySlug: beer.brewery.slug,
                }),
              ),
              name: beer.brewery.name,
            },
            category: "Beer",
            ...(beer.abv > 0
              ? { hasAdultConsideration: "AlcoholConsideration" }
              : {}),
            color: beer.color.name,
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Style",
                description: "Beer style",
                value: beer.style,
              },
              {
                "@type": "PropertyValue",
                name: "ABV",
                description: "Alcohol by volume",
                value: beer.abv,
              },
              ...(beer.ibu
                ? [
                    {
                      "@type": "PropertyValue" as const,
                      name: "IBU",
                      description: "International Bitterness Units",
                      value: beer.ibu,
                    },
                  ]
                : []),
            ],
            ...(latestReviews.results.length > 0
              ? {
                  review: latestReviews.results.map((review) => ({
                    "@type": "Review",
                    "@id": getAbsoluteUrl(
                      generatePath(Routes.REVIEW, {
                        username: review.username,
                        reviewSlug: review.slug,
                      }),
                    ),
                    url: getAbsoluteUrl(
                      generatePath(Routes.REVIEW, {
                        username: review.username,
                        reviewSlug: review.slug,
                      }),
                    ),
                    itemReviewed: {
                      "@type": "Product",
                      "@id": getAbsoluteUrl(
                        generatePath(Routes.BEER, {
                          brewerySlug: beer.brewery.slug,
                          beerSlug: beer.slug,
                        }),
                      ),
                      url: getAbsoluteUrl(
                        generatePath(Routes.BEER, {
                          brewerySlug: beer.brewery.slug,
                          beerSlug: beer.slug,
                        }),
                      ),
                      name: beer.name,
                    },
                    author: {
                      "@type": "Person",
                      "@id": getAbsoluteUrl(
                        generatePath(Routes.PROFILE, {
                          username: review.username,
                        }),
                      ),
                      url: getAbsoluteUrl(
                        generatePath(Routes.PROFILE, {
                          username: review.username,
                        }),
                      ),
                      name: review.username,
                    },
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: review.globalScore,
                      worstRating: 0,
                      bestRating: 10,
                    },
                    ...(review.pictureUrl ? { image: review.pictureUrl } : {}),
                    ...(review.comment ? { reviewBody: review.comment } : {}),
                    datePublished: review.createdAt.toISOString(),
                  })),
                }
              : {}),
          } satisfies WithContext<ProductJsonLd>
        }
      />

      <div className={cn("isolate flex flex-col", "gap-y-6 md:gap-y-2")}>
        <BeerCard
          name={beer.name}
          brewery={beer.brewery}
          abv={beer.abv}
          ibu={beer.ibu}
          style={beer.style}
          color={beer.color}
          organic={beer.organic}
          barrelAged={beer.barrelAged}
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
            link={getAbsoluteUrl(
              generatePath(Routes.BEER, {
                brewerySlug: beer.brewery.slug.slice(0, 4),
                beerSlug: beer.slug.slice(0, 4),
              }),
            )}
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
