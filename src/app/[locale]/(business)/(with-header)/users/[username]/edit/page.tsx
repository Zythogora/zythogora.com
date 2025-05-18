"use server";

import { getLocale, getTranslations } from "next-intl/server";

import EditProfileForm from "@/app/[locale]/(business)/(with-header)/users/[username]/edit/_components/edit-profile-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface EditProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

const EditProfilePage = async ({ params }: EditProfilePageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();
  const { username } = await params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect({ href: Routes.SIGN_IN, locale });
  }

  if (currentUser.username !== username) {
    return redirect({
      href: generatePath(Routes.PROFILE, { username }),
      locale,
    });
  }

  return (
    <div className={cn("isolate flex flex-col gap-y-8", "mt-12")}>
      <h1 className="text-2xl md:text-3xl">{t("editProfilePage.title")}</h1>

      <EditProfileForm username={currentUser.username} />
    </div>
  );
};

export default EditProfilePage;
