import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import HasVerifiedEmail from "@/app/[locale]/(business)/(with-header)/_components/has-verified-email";
import StPatrickHatIcon from "@/app/_components/icons/st-patrick-hat";
import { cn } from "@/lib/tailwind";

const HomePage = async () => {
  const t = await getTranslations();

  return (
    <>
      <Suspense>
        <HasVerifiedEmail />
      </Suspense>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-y-8",
          "pt-16 md:pt-8",
        )}
      >
        <h1 className="relative text-center text-4xl font-bold">
          {t.rich("home.title", {
            br: () => <br />,
            highlight: (chunks) => (
              <span className="text-primary text-5xl">{chunks}</span>
            ),
          })}

          <StPatrickHatIcon
            size={40}
            className="absolute -right-6 bottom-[calc(1ex-2px)] size-16 rotate-15"
          />
        </h1>

        <p className="max-w-md text-center text-2xl">
          {t.rich("home.stPatrickWelcomeMessage", {
            highlight: (chunks) => (
              <span className="text-primary font-bold">{chunks}</span>
            ),
          })}
        </p>
      </div>
    </>
  );
};

export default HomePage;
