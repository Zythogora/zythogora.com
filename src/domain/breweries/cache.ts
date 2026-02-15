import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getBreweryBySlug as _getBreweryBySlug,
  getBreweryAggregateRatingById as _getBreweryAggregateRatingById,
  getAllBreweryReviews as _getAllBreweryReviews,
  getLatestBreweryPublicPictures as _getLatestBreweryPublicPictures,
} from "@/domain/breweries";
import type { PaginationParams } from "@/lib/pagination/types";

export async function getCachedBreweryBySlug(brewerySlug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`brewery:${brewerySlug}`);
  return _getBreweryBySlug(brewerySlug);
}

export async function getCachedBreweryAggregateRatingById(
  brewerySlug: string,
  breweryId: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`brewery:${brewerySlug}:reviews`);
  return _getBreweryAggregateRatingById(breweryId);
}

export async function getCachedAllBreweryReviews(
  params: PaginationParams<{ brewerySlug: string }>,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`brewery:${params.brewerySlug}:reviews`);
  return _getAllBreweryReviews(params);
}

export async function getCachedLatestBreweryPublicPictures(params: {
  brewerySlug: string;
  count?: number;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`brewery:${params.brewerySlug}:reviews`);
  return _getLatestBreweryPublicPictures(params);
}
