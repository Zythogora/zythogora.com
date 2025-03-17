"use client";

import { useTranslations } from "next-intl";

import Chip from "@/app/_components/ui/chip";

interface UserSearchResultProps {
  username: string;
  reviewCount: number;
}

const UserSearchResult = ({ username, reviewCount }: UserSearchResultProps) => {
  const t = useTranslations();

  return (
    <div className="flex grow flex-col gap-y-1">
      <p className="font-title truncate text-lg">{username}</p>

      <Chip className="w-fit truncate">
        {t("searchPage.user.result.reviewCount", { count: reviewCount })}
      </Chip>
    </div>
  );
};

export default UserSearchResult;
