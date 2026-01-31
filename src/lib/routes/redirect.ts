import { Routes } from "@/lib/routes";

const allowedRoutes = new Set(Object.values(Routes));

const isValidRedirectUrl = (url: string) => {
  return url.startsWith("/") && !url.startsWith("//") && !url.includes("://");
};

export function getSafeRedirectUrl(rawRedirect: string | null): string;
export function getSafeRedirectUrl(
  rawRedirect: string | null,
  fallback: null,
): string | null;
export function getSafeRedirectUrl(
  rawRedirect: string | null,
  fallback: string,
): string;
export function getSafeRedirectUrl(
  rawRedirect: string | null,
  fallback?: string | null,
): string | null {
  if (!rawRedirect) {
    return fallback === undefined ? Routes.HOME : fallback;
  }

  if (allowedRoutes.has(rawRedirect as (typeof Routes)[keyof typeof Routes])) {
    return rawRedirect;
  }

  if (isValidRedirectUrl(rawRedirect)) {
    return rawRedirect;
  }

  return fallback === undefined ? Routes.HOME : fallback;
}
