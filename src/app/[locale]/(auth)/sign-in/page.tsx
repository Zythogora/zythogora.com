import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import SignInProviders from "@/app/[locale]/(auth)/_components/providers";
import SignInForm from "@/app/[locale]/(auth)/sign-in/_components/form";
import Wave from "@/app/_components/wave";
import { auth } from "@/lib/auth/server";
import { config } from "@/lib/config";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("auth.signIn.metadata.title"),
  };
}

const SignInPage = async () => {
  const t = await getTranslations();

  const locale = await getLocale();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: Routes.HOME, locale });
  }

  const availableProviders = config.auth.availableProviders;

  return (
    <>
      <div className="flex grow items-center justify-center">
        <h1 className="text-foreground text-center text-[40px] leading-none font-semibold">
          {t.rich("auth.signIn.title", {
            br: () => <br />,
          })}
        </h1>
      </div>

      <div
        className={cn(
          "relative flex h-3/4 min-h-fit flex-col items-center justify-center gap-y-12 p-12",
          "before:bg-primary before:absolute before:inset-0 before:z-[-2]",
          "**:data-[slot=button]:focus-visible:outline-foreground",
        )}
      >
        <Wave className="fill-primary absolute top-[calc(-5%+10px)] z-50 h-1/20" />

        <div className="flex w-full flex-col items-end gap-y-2 md:w-128">
          <SignInForm />
        </div>

        {availableProviders.length > 0 ? (
          <>
            <p
              className={cn(
                "font-title flex flex-row items-center gap-x-1.5 text-xs opacity-50",
                "before:bg-foreground before:h-px before:w-4",
                "after:bg-foreground after:h-px after:w-4",
              )}
            >
              {t("common.or")}
            </p>

            <SignInProviders availableProviders={availableProviders} />
          </>
        ) : null}
      </div>
    </>
  );
};

export default SignInPage;
