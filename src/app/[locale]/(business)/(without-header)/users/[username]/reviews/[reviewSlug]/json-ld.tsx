import JsonLd from "@/app/_components/json-ld";
import { getBeerAggregateRatingById } from "@/domain/beers";
import type { Review } from "@/domain/users/types";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl } from "@/lib/seo";

import type { Review as ReviewJsonLdSchema, WithContext } from "schema-dts";

interface ReviewJsonLdProps {
  review: Review;
}

const ReviewJsonLd = async ({ review }: ReviewJsonLdProps) => {
  const aggregateRating = await getBeerAggregateRatingById(review.beer.id);
  const reviewUrl = getAbsoluteUrl(
    generatePath(Routes.REVIEW, {
      username: review.user.username,
      reviewSlug: review.slug,
    }),
  );

  const beerUrl = getAbsoluteUrl(
    generatePath(Routes.BEER, {
      brewerySlug: review.beer.brewery.slug,
      beerSlug: review.beer.slug,
    }),
  );

  const breweryUrl = getAbsoluteUrl(
    generatePath(Routes.BREWERY, { brewerySlug: review.beer.brewery.slug }),
  );

  const userUrl = getAbsoluteUrl(
    generatePath(Routes.PROFILE, { username: review.user.username }),
  );

  const data: WithContext<ReviewJsonLdSchema> = {
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": reviewUrl,
    url: reviewUrl,
    itemReviewed: {
      "@type": "Product",
      "@id": beerUrl,
      url: beerUrl,
      name: review.beer.name,
      brand: {
        "@type": "Brewery",
        "@id": breweryUrl,
        url: breweryUrl,
        name: review.beer.brewery.name,
      },
      ...(aggregateRating ? { aggregateRating } : {}),
    },
    author: {
      "@type": "Person",
      "@id": userUrl,
      url: userUrl,
      name: review.user.username,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.globalScore,
      bestRating: 10,
      worstRating: 0,
    },
    ...(review.pictureUrl ? { image: review.pictureUrl } : {}),
    ...(review.comment ? { reviewBody: review.comment } : {}),
    datePublished: review.createdAt.toISOString(),
  };

  return <JsonLd data={data} />;
};

export default ReviewJsonLd;
