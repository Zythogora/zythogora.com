import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getUserByUsername as _getUserByUsername,
  getReviewsByUser as _getReviewsByUser,
  getLatestPicturesByUser as _getLatestPicturesByUser,
  getReviewByUsernameAndSlug as _getReviewByUsernameAndSlug,
  getUserVisitedCountries as _getUserVisitedCountries,
} from "@/domain/users";
import type { PaginationParams } from "@/lib/pagination/types";

export async function getCachedUserByUsername(username: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`user:${username.toLowerCase()}`);
  return _getUserByUsername(username);
}

export async function getCachedReviewsByUser(
  params: PaginationParams<{ userId: string }>,
  username: string,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`user:${username.toLowerCase()}:reviews`);
  return _getReviewsByUser(params);
}

export async function getCachedLatestPicturesByUser(
  params: { userId: string; count?: number },
  username: string,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`user:${username.toLowerCase()}:reviews`);
  return _getLatestPicturesByUser(params);
}

export async function getCachedReviewByUsernameAndSlug(
  username: string,
  reviewSlug: string,
) {
  "use cache";
  cacheLife("days");
  cacheTag(`review:${username.toLowerCase()}:${reviewSlug}`);
  return _getReviewByUsernameAndSlug(username, reviewSlug);
}

export async function getCachedUserVisitedCountries(
  userId: string,
  username: string,
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`user:${username.toLowerCase()}`);
  return _getUserVisitedCountries(userId);
}
