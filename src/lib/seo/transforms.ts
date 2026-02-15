import "server-only";

import type { RawStats } from "@/lib/seo/types";

import type { AggregateRating } from "schema-dts";

export const transformRawStatsToAggregateRating = ({
  count,
  average,
}: RawStats): Pick<
  AggregateRating,
  "@type" | "reviewCount" | "ratingValue" | "worstRating" | "bestRating"
> => ({
  "@type": "AggregateRating",
  reviewCount: count,
  ...(average ? { ratingValue: Number(average.toFixed(2)) } : {}),
  worstRating: 0,
  bestRating: 10,
});
