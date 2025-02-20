import { getTranslations } from "next-intl/server";

import SignInProviders from "@/app/[locale]/(auth)/_components/providers";
import SignInForm from "@/app/[locale]/(auth)/sign-in/_components/form";
import Wave from "@/app/_components/wave";
import { config } from "@/lib/config";
import { cn } from "@/lib/tailwind";

const SignInPage = async () => {
  const t = await getTranslations();

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
          "bg-primary relative flex h-[75vh] min-h-fit flex-col items-center justify-between gap-y-4 p-12",
          availableProviders.length > 0 ? "justify-between" : "justify-center",
        )}
      >
        <Wave className="fill-primary absolute top-[calc(-5vh+10px)] z-50 h-[5vh]" />

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
