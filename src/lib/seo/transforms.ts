import "server-only";

import type { RawStats } from "@/lib/seo/types";

import type { AggregateRating } from "schema-dts";

export const transformRawStatsToAggregateRating = ({
  count,
  average,
}: RawStats): Pick<
  AggregateRating,
  "@type" | "reviewCount" | "ratingValue" | "worstRating" | "bestRating"
> | null => {
  if (count === 0 || !average) {
    return null;
  }

  return {
    "@type": "AggregateRating",
    reviewCount: count,
    ratingValue: Number(average.toFixed(2)),
    worstRating: 0,
    bestRating: 10,
  };
};
