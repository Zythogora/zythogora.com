import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import UserReviewCard from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/review-card";
import UserHeader from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header";
import { profileSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/schemas";
import Pagination from "@/app/_components/ui/pagination";
import { getReviewsByUser, getUserByUsername } from "@/domain/users";
import { publicConfig } from "@/lib/config/client-config";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return {
    title: `${user.username} | ${publicConfig.appName}`,
  };
}

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const locale = await getLocale();

  const { username } = await params;

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

  const reviews = await getReviewsByUser({
    userId: user.id,
    page: searchParamsResult.data.page,
    limit: 10,
  });

  return (
    <div className="flex flex-col">
      <UserHeader user={user} />

      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-8",
          "px-10 py-12 md:px-0",
        )}
      >
        {reviews.results.map((review) => (
          <UserReviewCard key={review.id} review={review} />
        ))}

        <Pagination current={reviews.page.current} total={reviews.page.total} />
      </div>
    </div>
  );
};

export default ProfilePage;
