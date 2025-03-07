import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import HasVerifiedEmail from "@/app/[locale]/(business)/(app-with-header)/_components/has-verified-email";

const HomePage = async () => {
  const t = await getTranslations();

  return (
    <>
      <Suspense>
        <HasVerifiedEmail />
      </Suspense>

      <div className="flex flex-col items-center justify-center">
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
