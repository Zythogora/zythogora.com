import { getTranslations, setRequestLocale } from "next-intl/server";

import CreateBeerForm from "@/app/[locale]/(business)/(without-header)/create/beer/_components/form";
import { getColors, getStyleCategories } from "@/domain/beers";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

const CreateBeerPage = async ({
  params,
}: PageProps<"/[locale]/create/beer">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  await getCurrentUserOrRedirect({ redirectTo: Routes.CREATE_BEER });

  const [styleCategories, colors] = await Promise.all([
    getStyleCategories(),
    getColors(),
  ]);

  return (
    <div className="@container flex size-full min-h-screen items-center justify-center p-8">
      <div className="flex w-fit flex-col gap-y-8">
        <h1 className="text-2xl font-semibold">{t("createBeerPage.title")}</h1>

        <CreateBeerForm styleCategories={styleCategories} colors={colors} />
      </div>
    </div>
  );
};

export default CreateBeerPage;
