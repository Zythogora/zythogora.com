import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const FriendRequestNotFound = async () => {
  const t = await getTranslations();

  return (
    <>
      <p className="font-title text-2xl font-semibold">
        {t("friendRequestPage.404.title")}
      </p>

      <Link href={Routes.HOME} className="text-primary-700 underline">
        {t("friendRequestPage.404.cta")}
      </Link>
    </>
  );
};

export default FriendRequestNotFound;
