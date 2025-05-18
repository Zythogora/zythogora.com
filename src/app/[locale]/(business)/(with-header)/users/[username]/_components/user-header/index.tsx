import { getTranslations } from "next-intl/server";

import AddFriendButton from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header/add-friend";
import FriendshipStatus from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header/friendship-status";
import UserMore from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header/more";
import BreweryIcon from "@/app/_components/icons/brewery";
import PintIcon from "@/app/_components/icons/pint";
import StyleIcon from "@/app/_components/icons/style";
import WorldIcon from "@/app/_components/icons/world";
import DescriptionList from "@/app/_components/ui/description-list";
import { getFriendshipStatus } from "@/domain/users";
import {
  InvalidFriendRequestError,
  UnauthorizedFriendshipStatusCallError,
} from "@/domain/users/errors";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/tailwind";

import type { User } from "@/domain/users/types";

interface UserHeaderProps {
  user: User;
}

const UserHeader = async ({ user }: UserHeaderProps) => {
  const t = await getTranslations();

  const currentUser = await getCurrentUser();

  const friendshipStatus = await getFriendshipStatus(user.id).catch((error) => {
    if (error instanceof UnauthorizedFriendshipStatusCallError) {
      return null;
    }

    if (error instanceof InvalidFriendRequestError) {
      return null;
    }

    console.error(error);
    return null;
  });

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex flex-col gap-y-8 overflow-hidden drop-shadow",
          "border-b-2 px-10 py-14 md:rounded md:border-2 md:px-12 md:py-10",
          "bg-primary-50 dark:bg-primary-800",
        )}
      >
        <div
          className={cn(
            "grid items-center gap-y-1",
            "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_repeat(2,auto)]",
          )}
        >
          <div className="flex flex-col md:gap-y-1">
            <h1 className="text-2xl md:text-4xl">{user.username}</h1>

            <p className="text-xs md:text-sm">
              {t("profilePage.statistics.reviewCount", {
                count: user.reviewCount,
              })}
            </p>
          </div>

          {friendshipStatus ? (
            friendshipStatus === "NOT_FRIENDS" ? (
              <AddFriendButton
                friendId={user.id}
                className={cn(
                  "hidden md:flex",
                  "*:data-[slot=button]:h-fit *:data-[slot=button]:px-4 *:data-[slot=button]:py-2",
                )}
              />
            ) : (
              <FriendshipStatus
                status={friendshipStatus}
                className="col-start-1 row-start-2 md:col-start-2 md:row-start-1"
              />
            )
          ) : null}

          <UserMore
            self={currentUser?.username === user.username}
            username={user.username}
            isFriend={friendshipStatus === "FRIENDS"}
            className="col-start-2 md:col-start-3"
          />
        </div>

        <div
          className={cn(
            "grid gap-4",
            "grid-cols-2 min-[512px]:grid-cols-4",
            "*:flex *:flex-row *:items-center",
            "*:gap-x-2 md:*:gap-x-3 lg:*:gap-x-4",
            "**:[&_svg]:stroke-foreground **:[&_svg]:fill-foreground **:[&_svg]:shrink-0 **:[&_svg]:stroke-[0.25px]",
            "**:[&_svg]:size-5 md:**:[&_svg]:size-7",
            "**:data-[slot=description-term]:truncate",
          )}
        >
          <div>
            <PintIcon size={20} className="fill-transparent! stroke-1!" />

            <DescriptionList
              label={t("profilePage.statistics.uniqueBeers")}
              value={user.uniqueBeerCount}
            />
          </div>

          <div>
            <BreweryIcon size={20} />

            <DescriptionList
              label={t("profilePage.statistics.uniqueBreweries")}
              value={user.uniqueBreweryCount}
            />
          </div>

          <div>
            <StyleIcon size={20} />

            <DescriptionList
              label={t("profilePage.statistics.uniqueStyles")}
              value={user.uniqueStyleCount}
            />
          </div>

          <div>
            <WorldIcon size={20} />

            <DescriptionList
              label={t("profilePage.statistics.uniqueCountries")}
              value={user.uniqueCountryCount}
            />
          </div>
        </div>
      </div>

      {friendshipStatus === "NOT_FRIENDS" ? (
        <AddFriendButton friendId={user.id} className="flex p-10 md:hidden" />
      ) : null}
    </div>
  );
};

export default UserHeader;
