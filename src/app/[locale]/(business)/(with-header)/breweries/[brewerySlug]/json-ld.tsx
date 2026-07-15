import JsonLd from "@/app/_components/json-ld";
import {
  getAllBreweryReviews,
  getBreweryAggregateRatingById,
} from "@/domain/breweries";
import type { Brewery } from "@/domain/breweries/types";
import { publicConfig } from "@/lib/config/client-config";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl, getBreadcrumbListJsonLd } from "@/lib/seo";

import type { Brewery as BreweryJsonLdSchema, WithContext } from "schema-dts";

interface BreweryJsonLdProps {
  brewery: Brewery;
}

const BreweryJsonLd = async ({ brewery }: BreweryJsonLdProps) => {
  const [aggregateRating, latestReviews] = await Promise.all([
    getBreweryAggregateRatingById(brewery.id),
    getAllBreweryReviews({ brewerySlug: brewery.slug, limit: 5, page: 1 }),
  ]);

  const breweryUrl = getAbsoluteUrl(
    generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
  );

  const data: WithContext<BreweryJsonLdSchema> = {
    "@context": "https://schema.org",
    "@type": "Brewery",
    "@id": breweryUrl,
    url: breweryUrl,
    name: brewery.name,
    ...(brewery.description ? { description: brewery.description } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
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
          review: latestReviews.results.toReversed().map((review) => ({
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
  };

  const breadcrumb = getBreadcrumbListJsonLd([
    {
      name: publicConfig.appName,
      path: Routes.HOME,
    },
    {
      name: brewery.name,
      path: generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
    },
  ]);

  return (
    <>
      <JsonLd data={data} />

      <JsonLd data={breadcrumb} />
    </>
  );
};

export default BreweryJsonLd;
