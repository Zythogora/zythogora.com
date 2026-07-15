import { getTranslations, setRequestLocale } from "next-intl/server";

import UpdateUsernameForm from "@/app/[locale]/(business)/(with-header)/settings/_components/update-username-form";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/settings">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("settingsPage.metadata.title"),
    robots: { index: false },
  };
}

const SettingsPage = async ({ params }: PageProps<"/[locale]/settings">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const user = await getCurrentUserOrRedirect({
    redirectTo: Routes.SETTINGS,
  });

  return (
    <div className={cn("flex flex-col gap-y-8 pt-12", "px-10 md:px-0")}>
      <h1 className="text-2xl md:text-3xl">{t("settingsPage.title")}</h1>

      <section className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-lg font-semibold">
            {t("settingsPage.username.title")}
          </h2>

          <p className="text-foreground/62.5 text-sm">
            {t("settingsPage.username.description")}
          </p>
        </div>

        <UpdateUsernameForm currentUsername={user.username} />
      </section>
    </div>
  );
};

export default SettingsPage;
