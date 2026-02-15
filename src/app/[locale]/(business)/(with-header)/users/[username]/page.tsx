import { notFound } from "next/navigation";
import { Suspense } from "react";

import UserReviewCard from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/review-card";
import UserHeader from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header";
import { profileSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/schemas";
import Await from "@/app/_components/await";
import JsonLd from "@/app/_components/json-ld";
import ReviewPictureGrid from "@/app/_components/review-picture-grid";
import ReviewPictureGridLoader from "@/app/_components/review-picture-grid/loader";
import Pagination from "@/app/_components/ui/pagination";
import {
  getReviewsByUser,
  getUserByUsername,
  getLatestPicturesByUser,
  getUserVisitedCountries,
} from "@/domain/users";
import { publicConfig } from "@/lib/config/client-config";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl, getAlternates } from "@/lib/seo";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";
import type { Person as PersonJsonLd, WithContext } from "schema-dts";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/users/[username]">): Promise<Metadata> {
  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return {
    title: `${user.username} | ${publicConfig.appName}`,
    alternates: getAlternates(
      generatePath(Routes.PROFILE, { username: user.username }),
    ),
  };
}

const ProfilePage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/users/[username]">) => {
  const { locale, username } = await params;

  const searchParamsResult = profileSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return redirect({
      href: generatePath(Routes.PROFILE, { username }),
      locale,
    });
  }

  const user = await getUserByUsername(username).catch(() => notFound());

  if (user.username !== username) {
    redirect({
      href: `${generatePath(Routes.PROFILE, { username: user.username })}${
        searchParamsResult.data.page
          ? `?page=${searchParamsResult.data.page}`
          : ""
      }`,
      locale,
    });
  }

  const latestPicturesPromise = getLatestPicturesByUser({ userId: user.id });

  const [reviews, visitedCountries] = await Promise.all([
    getReviewsByUser({
      userId: user.id,
      page: searchParamsResult.data.page,
      limit: 10,
    }),
    getUserVisitedCountries(user.id),
  ]);

  return (
    <div className="flex flex-col gap-y-6">
      <JsonLd
        data={
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": getAbsoluteUrl(generatePath(Routes.PROFILE, { username: user.username })),
            url: getAbsoluteUrl(generatePath(Routes.PROFILE, { username: user.username })),
            name: user.username,
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: { "@type": "WriteAction" },
              userInteractionCount: user.reviewCount,
            },
          } satisfies WithContext<PersonJsonLd>
        }
      />

      <UserHeader user={user} visitedCountries={visitedCountries} />

      <div className={cn("mt-4 md:-mt-1", "px-10 md:px-0")}>
        <Suspense fallback={<ReviewPictureGridLoader />}>
          <Await promise={latestPicturesPromise}>
            {(pictures) => <ReviewPictureGrid pictures={pictures} />}
          </Await>
        </Suspense>
      </div>

      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8",
          "px-10 md:px-0",
        )}
      >
        {reviews.results.map((review) => (
          <UserReviewCard
            key={review.id}
            username={user.username}
            review={review}
          />
        ))}

        <Pagination
          current={reviews.page.current}
          total={reviews.page.total}
          className="col-span-2"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
