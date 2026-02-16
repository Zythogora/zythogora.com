import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";

import CreateBeerForm from "@/app/[locale]/(business)/(without-header)/create/beer/_components/form";
import { getCachedColors, getCachedStyleCategories } from "@/domain/beers/cache";
import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const CreateBeerPage = async ({
  params,
}: PageProps<"/[locale]/create/beer">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: { redirect: Routes.CREATE_BEER },
      },
      locale,
    });
  }

  const [styleCategories, colors] = await Promise.all([
    getCachedStyleCategories(),
    getCachedColors(),
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
