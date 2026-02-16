import JsonLd from "@/app/_components/json-ld";
import {
  getCachedAllBeerReviews,
  getCachedBeerAggregateRatingById,
} from "@/domain/beers/cache";
import type { Beer } from "@/domain/beers/types";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl } from "@/lib/seo";

import type { Product as ProductJsonLdSchema, WithContext } from "schema-dts";

interface BeerJsonLdProps {
  beer: Beer;
}

const BeerJsonLd = async ({ beer }: BeerJsonLdProps) => {
  const [aggregateRating, latestReviews] = await Promise.all([
    getCachedBeerAggregateRatingById(beer.id),
    getCachedAllBeerReviews({ beerId: beer.id, limit: 5, page: 1 }),
  ]);

  const beerUrl = getAbsoluteUrl(
    generatePath(Routes.BEER, {
      brewerySlug: beer.brewery.slug,
      beerSlug: beer.slug,
    }),
  );

  const breweryUrl = getAbsoluteUrl(
    generatePath(Routes.BREWERY, { brewerySlug: beer.brewery.slug }),
  );

  const data: WithContext<ProductJsonLdSchema> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": beerUrl,
    url: beerUrl,
    name: beer.name,
    ...(beer.description && { description: beer.description }),
    ...(aggregateRating ? { aggregateRating } : {}),
    brand: {
      "@type": "Brewery",
      "@id": breweryUrl,
      url: breweryUrl,
      name: beer.brewery.name,
    },
    category: "Beer",
    ...(beer.abv > 0 ? { hasAdultConsideration: "AlcoholConsideration" } : {}),
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
          review: latestReviews.results.toReversed().map((review) => ({
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
  };

  return <JsonLd data={data} />;
};

export default BeerJsonLd;
