import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import UserHeader from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header";
import { getUserByUsername } from "@/domain/users";
import { publicConfig } from "@/lib/config/client-config";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { PropsWithChildren } from "react";

interface ProfileLayoutProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfileLayoutProps) {
  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return {
    title: `${user.username} | ${publicConfig.appName}`,
  };
}

const ProfileLayout = async ({
  params,
  children,
}: PropsWithChildren<ProfileLayoutProps>) => {
  const locale = await getLocale();

  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  if (user.username !== username) {
    redirect({
      href: generatePath(Routes.PROFILE, { username: user.username }),
      locale,
    });
  }

  return (
    <div className="flex flex-col">
      <UserHeader user={user} />

      {children}
    </div>
  );
};

export default ProfileLayout;
