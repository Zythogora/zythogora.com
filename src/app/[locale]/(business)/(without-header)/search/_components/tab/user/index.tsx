import { getTranslations } from "next-intl/server";

import UserSearchResult from "@/app/[locale]/(business)/(without-header)/search/_components/tab/user/result";
import Pagination from "@/app/_components/ui/pagination";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { UserResult } from "@/domain/search/types";

interface UserTabProps {
  results: UserResult[];
  count: number;
  page: {
    current: number;
    total: number;
  };
}

const UserTab = async ({ results, count, page }: UserTabProps) => {
  const t = await getTranslations();

  if (results.length === 0) {
    return <p>{t("searchPage.user.noResult")}</p>;
  }

  return (
    <>
      <p>{t("searchPage.user.results", { count })}</p>

      <div className="flex w-full flex-col gap-y-8">
        {results.map((user) => (
          <Link
            key={user.id}
            href={generatePath(Routes.PROFILE, {
              username: user.username,
            })}
          >
            <UserSearchResult
              key={user.id}
              username={user.username}
              reviewCount={user.reviewCount}
            />
          </Link>
        ))}

        <Pagination current={page.current} total={page.total} />
      </div>
    </>
  );
};

export default UserTab;
