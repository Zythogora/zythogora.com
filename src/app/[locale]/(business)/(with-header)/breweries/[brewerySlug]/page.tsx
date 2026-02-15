import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import BreweryBeerList from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-beer-list";
import BreweryCard from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-card";
import BreweryReviews from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-reviews";
import BreweryTabList from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/_components/brewery-tab-list";
import { brewerySearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/breweries/[brewerySlug]/schemas";
import JsonLd from "@/app/_components/json-ld";
import { Tabs, TabContent } from "@/app/_components/ui/tabs";
import {
  getAllBreweryReviews,
  getBreweryBySlug,
  getBreweryAggregateRatingById,
} from "@/domain/breweries";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { StaticGenerationMode } from "@/lib/config/types";
import { redirect } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl, getAlternates } from "@/lib/seo";
import { cn } from "@/lib/tailwind";
import { exhaustiveCheck } from "@/lib/typescript/utils";

import type { Metadata } from "next";
import type { Brewery as BreweryJsonLd, WithContext } from "schema-dts";

export async function generateStaticParams(): Promise<
  Array<
    Omit<
      Awaited<PageProps<"/[locale]/breweries/[brewerySlug]">["params"]>,
      "locale"
    >
  >
> {
  if (config.next.staticGeneration === StaticGenerationMode.NONE) {
    // There's a bug in Next.js that crashes dynamic routes when using
    // generateStaticParams and an empty array of params.
    // The workaround is to return a dummy value.
    return [{ brewerySlug: "-" }];
  }

  const breweries = await prisma.breweries.findMany();

  const slugs = breweries.map((brewery) => ({ brewerySlug: brewery.slug }));

  if (config.next.staticGeneration === StaticGenerationMode.SLUG_ONLY) {
    return slugs;
  }

  if (config.next.staticGeneration === StaticGenerationMode.ALL) {
    return slugs
      .map((slug) => [slug, { brewerySlug: slug.brewerySlug.slice(0, 4) }])
      .flat();
  }

  return exhaustiveCheck({
    value: config.next.staticGeneration,
    error: "Invalid static generation mode for the brewery page params",
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]">): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  const title = `${brewery.name} | ${publicConfig.appName}`;
  const description = t("breweryPage.metadata.description", {
    breweryName: brewery.name,
    countryName: brewery.location.country.name,
    beerCount: brewery.beers.length,
  });

  return {
    title,
    description,
    alternates: getAlternates(
      generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
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

const BreweryPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/breweries/[brewerySlug]">) => {
  const locale = await getLocale();

  const { brewerySlug } = await params;

  const searchParamsResult = brewerySearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return redirect({
      href: generatePath(Routes.BREWERY, { brewerySlug }),
      locale,
    });
  }

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  if (brewery.slug !== brewerySlug) {
    redirect({
      href: generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
      locale,
    });
  }

  const [aggregateRating, latestReviews] = await Promise.all([
    getBreweryAggregateRatingById(brewery.id),
    getAllBreweryReviews({ brewerySlug: brewery.slug, limit: 5, page: 1 }),
  ]);

  return (
    <div className={cn("flex w-full flex-col", "gap-y-16 md:gap-y-12")}>
      <JsonLd
        data={
          {
            "@context": "https://schema.org",
            "@type": "Brewery",
            "@id": getAbsoluteUrl(
              generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
            ),
            url: getAbsoluteUrl(
              generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
            ),
            name: brewery.name,
            ...(brewery.description
              ? { description: brewery.description }
              : {}),
            ...(aggregateRating.reviewCount ? { aggregateRating } : {}),
            address: {
              "@type": "PostalAddress",
              addressCountry: brewery.location.country.code,
              ...(brewery.location.state
                ? { addressRegion: brewery.location.state }
                : {}),
              ...(brewery.location.city
                ? { addressLocality: brewery.location.city }
                : {}),
              ...(brewery.location.address
                ? { streetAddress: brewery.location.address }
                : {}),
            },
            ...(brewery.creationYear
              ? { foundingDate: String(brewery.creationYear) }
              : {}),
            ...(brewery.contactEmail ? { email: brewery.contactEmail } : {}),
            ...(brewery.contactPhoneNumber
              ? { telephone: brewery.contactPhoneNumber }
              : {}),
            ...(brewery.websiteLink ? { sameAs: brewery.websiteLink } : {}),
            ...(latestReviews.results.length > 0
              ? {
                  review: latestReviews.results.map((review) => ({
                    "@type": "Review",
                    "@id": getAbsoluteUrl(
                      generatePath(Routes.REVIEW, {
                        username: review.user.username,
                        reviewSlug: review.slug,
                      }),
                    ),
                    url: getAbsoluteUrl(
                      generatePath(Routes.REVIEW, {
                        username: review.user.username,
                        reviewSlug: review.slug,
                      }),
                    ),
                    itemReviewed: {
                      "@type": "Product",
                      "@id": getAbsoluteUrl(
                        generatePath(Routes.BEER, {
                          brewerySlug: brewery.slug,
                          beerSlug: review.beer.slug,
                        }),
                      ),
                      url: getAbsoluteUrl(
                        generatePath(Routes.BEER, {
                          brewerySlug: brewery.slug,
                          beerSlug: review.beer.slug,
                        }),
                      ),
                      name: review.beer.name,
                      brand: {
                        "@type": "Brewery",
                        "@id": getAbsoluteUrl(
                          generatePath(Routes.BREWERY, {
                            brewerySlug: brewery.slug,
                          }),
                        ),
                        url: getAbsoluteUrl(
                          generatePath(Routes.BREWERY, {
                            brewerySlug: brewery.slug,
                          }),
                        ),
                        name: brewery.name,
                      },
                    },
                    author: {
                      "@type": "Person",
                      "@id": getAbsoluteUrl(
                        generatePath(Routes.PROFILE, {
                          username: review.user.username,
                        }),
                      ),
                      url: getAbsoluteUrl(
                        generatePath(Routes.PROFILE, {
                          username: review.user.username,
                        }),
                      ),
                      name: review.user.username,
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
          } satisfies WithContext<BreweryJsonLd>
        }
      />

      <BreweryCard brewery={brewery} />

      <div className="px-10 md:px-0">
        <Tabs defaultValue={searchParamsResult.data.tab}>
          <BreweryTabList brewerySlug={brewerySlug} />

          <TabContent value="beers">
            <BreweryBeerList brewerySlug={brewerySlug} beers={brewery.beers} />
          </TabContent>

          <TabContent value="reviews">
            <BreweryReviews
              brewerySlug={brewerySlug}
              page={searchParamsResult.data.page}
            />
          </TabContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BreweryPage;
