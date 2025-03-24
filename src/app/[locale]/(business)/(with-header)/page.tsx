import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import HasVerifiedEmail from "@/app/[locale]/(business)/(with-header)/_components/has-verified-email";
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
        <h1 className="text-center text-4xl font-bold">
          {t.rich("home.title", {
            br: () => <br />,
            highlight: (chunks) => (
              <span className="text-primary text-5xl">{chunks}</span>
            ),
          })}
        </h1>
      </div>
    </>
  );
};

export default HomePage;
