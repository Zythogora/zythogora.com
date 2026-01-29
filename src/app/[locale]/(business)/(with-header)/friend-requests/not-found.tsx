"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const FriendRequestNotFound = () => {
  const t = useTranslations();

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
