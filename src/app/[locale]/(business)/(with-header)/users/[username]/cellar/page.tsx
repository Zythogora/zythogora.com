import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import CellarFilters from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/_components/cellar-filters";
import CellarItemCard from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/_components/cellar-item-card";
import CellarStats from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/_components/cellar-stats";
import { cellarSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/schemas";
import Pagination from "@/app/_components/ui/pagination";
import {
  getCellarItemsByUser,
  getCellarStats,
} from "@/domain/cellar";
import { getStorageLocationsByUser } from "@/domain/storage-locations";
import { getUserByUsername } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";
import { publicConfig } from "@/lib/config/client-config";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/users/[username]/cellar">): Promise<Metadata> {
  const t = await getTranslations();
  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return {
    title: `${t("cellar.title")} - ${user.username} | ${publicConfig.appName}`,
  };
}

const CellarPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/users/[username]/cellar">) => {
  const t = await getTranslations();
  const locale = await getLocale();

  const { username } = await params;

  const searchParamsResult = cellarSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return redirect({
      href: generatePath(Routes.CELLAR, { username }),
      locale,
    });
  }

  const user = await getUserByUsername(username).catch(() => notFound());

  // Redirect to canonical username
  if (user.username !== username) {
    redirect({
      href: generatePath(Routes.CELLAR, { username: user.username }),
      locale,
    });
  }

  const currentUser = await getCurrentUser();

  // Only the owner can see their cellar
  if (!currentUser || currentUser.id !== user.id) {
    return redirect({
      href: generatePath(Routes.PROFILE, { username: user.username }),
      locale,
    });
  }

  const [cellarItems, stats, storageLocations] = await Promise.all([
    getCellarItemsByUser({
      userId: user.id,
      page: searchParamsResult.data.page,
      limit: 20,
      storageLocationId: searchParamsResult.data.storageLocationId,
      servingFormat: searchParamsResult.data.servingFormat,
      expiringWithinDays: searchParamsResult.data.expiringWithinDays,
    }),
    getCellarStats(user.id),
    getStorageLocationsByUser(user.id),
  ]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className={cn("px-10 md:px-0")}>
        <h1 className="font-title text-3xl font-bold">{t("cellar.title")}</h1>
      </div>

      <CellarStats stats={stats} />

      <CellarFilters
        storageLocations={storageLocations}
        currentFilters={searchParamsResult.data}
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          "px-10 md:px-0",
        )}
      >
        {cellarItems.results.length === 0 ? (
          <div className="py-8 text-center text-foreground-muted">
            {t("cellar.empty")}
          </div>
        ) : (
          cellarItems.results.map((item) => (
            <CellarItemCard
              key={item.id}
              item={item}
              storageLocations={storageLocations}
              username={user.username}
            />
          ))
        )}

        <Pagination
          current={cellarItems.page.current}
          total={cellarItems.page.total}
        />
      </div>
    </div>
  );
};

export default CellarPage;
