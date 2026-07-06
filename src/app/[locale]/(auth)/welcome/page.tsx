import { getTranslations, setRequestLocale } from "next-intl/server";

import WelcomeForm from "@/app/[locale]/(auth)/welcome/_components/form";
import Wave from "@/app/_components/wave";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/welcome">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("auth.welcome.metadata.title"),
  };
}

const WelcomePage = async ({ params }: PageProps<"/[locale]/welcome">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const user = await getCurrentUser();

  if (!user) {
    return redirect({ href: Routes.SIGN_IN, locale });
  }

  if (user.username !== null) {
    return redirect({ href: Routes.HOME, locale });
  }

  return (
    <>
      <div className="flex grow flex-col items-center justify-center gap-y-4 px-8">
        <h1 className="text-foreground text-center text-[40px] leading-none font-semibold">
          {t.rich("auth.welcome.title", {
            br: () => <br />,
          })}
        </h1>

        <p className="text-foreground text-center">
          {t("auth.welcome.description")}
        </p>
      </div>

      <div
        className={cn(
          "relative flex h-3/4 min-h-fit flex-col items-center justify-center gap-y-12 p-12",
          "before:bg-primary before:absolute before:inset-0 before:z-[-2]",
          "**:data-[slot=button]:focus-visible:outline-foreground",
        )}
      >
        <Wave className="fill-primary absolute top-[calc(-5%+10px)] z-50 h-1/20" />

        <div className="flex w-full flex-col items-end gap-y-2 md:w-lg">
          <WelcomeForm />
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
