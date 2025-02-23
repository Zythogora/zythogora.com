import { getTranslations } from "next-intl/server";

import NotFoundIllustration from "@/app/_components/ui/not-found-illustration";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const NotFound = async () => {
  const t = await getTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center gap-y-8">
        <NotFoundIllustration />

        <h1 className="text-center text-3xl">
          {t.rich("beerPage.404.title", {
            br: () => <br />,
            muted: (chunks) => (
              <span className="text-foreground-muted">{chunks}</span>
            ),
          })}
        </h1>

        <p className="text-center">
          {t.rich("beerPage.404.cta", {
            link: (chunks) => (
              <Link href={Routes.SEARCH} className="text-primary underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
