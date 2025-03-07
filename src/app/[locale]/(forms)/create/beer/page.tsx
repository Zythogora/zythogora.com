import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import CreateBeerForm from "@/app/[locale]/(forms)/create/beer/_components/form";
import { getColors, getLegacyStyles } from "@/domain/beers";
import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const CreateBeerPage = async () => {
  const t = await getTranslations();

  const locale = await getLocale();

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

  const [legacyStyles, colors] = await Promise.all([
    getLegacyStyles(),
    getColors(),
  ]);

  return (
    <div className="@container flex size-full min-h-screen items-center justify-center p-8">
      <div className="flex w-fit flex-col gap-y-8">
        <h1 className="text-2xl font-semibold">{t("createBeerPage.title")}</h1>

        <CreateBeerForm styles={legacyStyles} colors={colors} />
      </div>
    </div>
  );
};

export default CreateBeerPage;
