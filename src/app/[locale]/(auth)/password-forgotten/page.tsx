import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import PasswordForgottenForm from "@/app/[locale]/(auth)/password-forgotten/_components/form";
import { passwordForgottenSearchParamsSchema } from "@/app/[locale]/(auth)/password-forgotten/schemas";
import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("auth.passwordForgotten.metadata.title"),
  };
}

const PasswordForgottenPage = async ({
  searchParams,
}: PageProps<"/[locale]/password-forgotten">) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: Routes.HOME, locale });
  }

  const searchParamsResult = passwordForgottenSearchParamsSchema.safeParse(
    await searchParams,
  );

  const email = searchParamsResult.success ? searchParamsResult.data.email : "";

  return (
    <div className="mx-auto flex h-screen w-full flex-col items-center justify-center gap-y-12 p-12 md:w-lg">
      <div className="flex w-full flex-col gap-y-4">
        <h1 className="text-[40px] leading-none font-semibold">
          {t("auth.passwordForgotten.title")}
        </h1>

        <p>{t("auth.passwordForgotten.description")}</p>
      </div>

      <PasswordForgottenForm email={email} />
    </div>
  );
};

export default PasswordForgottenPage;
