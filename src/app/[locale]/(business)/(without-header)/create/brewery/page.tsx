import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import CreateBreweryForm from "@/app/[locale]/(business)/(without-header)/create/brewery/_components/form";
import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const CreateBreweryPage = async () => {
  const t = await getTranslations();

  const locale = await getLocale();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: { redirect: Routes.CREATE_BREWERY },
      },
      locale,
    });
  }

  return (
    <div className="@container flex size-full min-h-screen items-center justify-center p-8">
      <div className="flex w-fit flex-col gap-y-8">
        <h1 className="text-2xl font-semibold">
          {t("createBreweryPage.title")}
        </h1>

        <CreateBreweryForm />
      </div>
    </div>
  );
};

export default CreateBreweryPage;
