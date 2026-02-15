import { generateSitemaps as generateBeerSitemaps } from "@/app/beers/sitemap";
import { generateSitemaps as generateBrewerySitemaps } from "@/app/breweries/sitemap";
import { generateSitemaps as generateReviewSitemaps } from "@/app/reviews/sitemap";
import { generateSitemaps as generateUserSitemaps } from "@/app/users/sitemap";
import prisma from "@/lib/prisma";
import { getAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const getLastModifiedBeer = async () => {
  const beer = await prisma.beers.findFirst({
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return beer?.updatedAt.toISOString() ?? undefined;
};

const getLastModifiedBrewery = async () => {
  const brewery = await prisma.breweries.findFirst({
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return brewery?.updatedAt.toISOString() ?? undefined;
};

const getLastModifiedReview = async () => {
  const review = await prisma.reviews.findFirst({
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return review?.updatedAt.toISOString() ?? undefined;
};

const getLastModifiedUser = async () => {
  const user = await prisma.users.findFirst({
    select: { betterAuthUser: { select: { updatedAt: true } } },
    orderBy: { betterAuthUser: { updatedAt: "desc" } },
  });
  return user?.betterAuthUser.updatedAt.toISOString() ?? undefined;
};

const getSitemaps = (
  ids: { id: number }[],
  path: string,
  lastModified: string,
) => {
  return ids
    .map(
      ({ id }) => `<sitemap>
    <loc>${getAbsoluteUrl(`/${path}/sitemap/${id}.xml`)}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`,
    )
    .join("\n");
};

export const GET = async () => {
  const lastModified = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
  <sitemap>
    <loc>${getAbsoluteUrl("/sitemap.xml")}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>
  ${getSitemaps(await generateBeerSitemaps(), "beers", (await getLastModifiedBeer()) ?? lastModified)}
  ${getSitemaps(await generateBrewerySitemaps(), "breweries", (await getLastModifiedBrewery()) ?? lastModified)}
  ${getSitemaps(await generateReviewSitemaps(), "reviews", (await getLastModifiedReview()) ?? lastModified)}
  ${getSitemaps(await generateUserSitemaps(), "users", (await getLastModifiedUser()) ?? lastModified)}
</sitemapindex>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
