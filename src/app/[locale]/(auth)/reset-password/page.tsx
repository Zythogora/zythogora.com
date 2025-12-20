import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import ResetPasswordForm from "@/app/[locale]/(auth)/reset-password/_components/form";
import { auth } from "@/lib/auth/server";
import { Link, redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("auth.resetPassword.metadata.title"),
  };
}

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: Routes.HOME, locale });
  }

  const { token, error } = await searchParams;

  if (!token && !error) {
    return redirect({ href: Routes.HOME, locale });
  }

  if (error) {
    return (
      <div className="mx-auto flex h-screen w-full flex-col items-center justify-center gap-y-12 p-12 md:w-128">
        <div className="flex w-full flex-col gap-y-4">
          <h1 className="text-[40px] leading-none font-semibold">
            {t("auth.resetPassword.title")}
          </h1>

          <p>
            {t.rich("auth.resetPassword.actions.requestNewToken", {
              br: () => <br />,
              link: (chunks) => (
                <Link
                  href={Routes.PASSWORD_FORGOTTEN}
                  className="text-primary-700 underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="mx-auto flex h-screen w-full flex-col items-center justify-center gap-y-12 p-12 md:w-128">
        <div className="flex w-full flex-col gap-y-4">
          <h1 className="text-[40px] leading-none font-semibold">
            {t("auth.resetPassword.title")}
          </h1>

          <p>{t("auth.resetPassword.description")}</p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    );
  }

  // This should never happen
  console.error("No token or error");
  redirect({ href: Routes.HOME, locale });
};

export default ResetPasswordPage;
