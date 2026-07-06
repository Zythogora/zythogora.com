import { getTranslations, setRequestLocale } from "next-intl/server";

import CreateBreweryForm from "@/app/[locale]/(business)/(without-header)/create/brewery/_components/form";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { Routes } from "@/lib/routes";

const CreateBreweryPage = async ({
  params,
}: PageProps<"/[locale]/create/brewery">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  await getCurrentUserOrRedirect({ redirectTo: Routes.CREATE_BREWERY });

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
