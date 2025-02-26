import { getTranslations } from "next-intl/server";

import SignInProviders from "@/app/[locale]/(auth)/_components/providers";
import SignUpForm from "@/app/[locale]/(auth)/sign-up/_components/form";
import Wave from "@/app/_components/wave";
import { config } from "@/lib/config";
import { cn } from "@/lib/tailwind";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("auth.signUp.metadata.title"),
  };
}

const SignUpPage = async () => {
  const t = await getTranslations();

  const availableProviders = config.auth.availableProviders;

  return (
    <>
      <div className="flex grow items-center justify-center">
        <h1 className="text-foreground text-center text-[40px] leading-none font-semibold">
          {t.rich("auth.signUp.title", {
            br: () => <br />,
          })}
        </h1>
      </div>

      <div
        className={cn(
          "relative flex h-3/4 min-h-fit flex-col items-center justify-between gap-y-4 p-12",
          "before:bg-primary before:absolute before:inset-0 before:z-[-2]",
          "**:data-[slot=button]:focus-visible:outline-foreground",
          availableProviders.length > 0 ? "justify-between" : "justify-center",
        )}
      >
        <Wave className="fill-primary absolute top-[calc(-5%+10px)] z-50 h-1/20" />

        <div className="flex w-full flex-col items-end gap-y-2 md:w-128">
          <SignUpForm />
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

export default SignUpPage;
