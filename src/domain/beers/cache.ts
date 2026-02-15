import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getBeerBySlug as _getBeerBySlug,
  getBeerAggregateRatingById as _getBeerAggregateRatingById,
  getColors as _getColors,
  getStyleCategories as _getStyleCategories,
  getAllBeerReviews as _getAllBeerReviews,
  getLatestPublicPictures as _getLatestPublicPictures,
} from "@/domain/beers";
import type { PaginationParams } from "@/lib/pagination/types";

export async function getCachedBeerBySlug(
  beerSlug: string,
  brewerySlug: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`beer:${beerSlug}`);
  return _getBeerBySlug(beerSlug, brewerySlug);
}

export async function getCachedBeerAggregateRatingById(beerId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`beer:${beerId}:reviews`);
  return _getBeerAggregateRatingById(beerId);
}

export async function getCachedColors() {
  "use cache";
  cacheLife("max");
  cacheTag("reference:colors");
  return _getColors();
}

export async function getCachedStyleCategories() {
  "use cache";
  cacheLife("max");
  cacheTag("reference:styles");
  return _getStyleCategories();
}

export async function getCachedAllBeerReviews(
  params: PaginationParams<{ beerId: string }>,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`beer:${params.beerId}:reviews`);
  return _getAllBeerReviews(params);
}

export async function getCachedLatestPublicPictures(params: {
  beerId: string;
  count?: number;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`beer:${params.beerId}:reviews`);
  return _getLatestPublicPictures(params);
}
