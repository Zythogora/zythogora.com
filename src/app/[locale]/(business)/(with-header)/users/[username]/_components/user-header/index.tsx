import { getTranslations } from "next-intl/server";

import BreweryIcon from "@/app/_components/icons/brewery";
import PintIcon from "@/app/_components/icons/pint";
import StyleIcon from "@/app/_components/icons/style";
import WorldIcon from "@/app/_components/icons/world";
import DescriptionList from "@/app/_components/ui/description-list";
import { cn } from "@/lib/tailwind";

import type { User } from "@/domain/users/types";

interface UserHeaderProps {
  user: User;
}

const UserHeader = async ({ user }: UserHeaderProps) => {
  const t = await getTranslations();

  return (
    <div
      className={cn(
        "flex flex-col gap-y-8 overflow-hidden px-12 drop-shadow",
        "border-b-2 py-14 md:rounded md:border-2 md:py-10",
        "bg-primary-50 dark:bg-primary-800",
      )}
    >
      <div className="flex flex-col md:gap-y-1">
        <h1 className="text-2xl md:text-4xl">{user.username}</h1>

        <p className="text-xs md:text-sm">
          {t("profilePage.reviewCount", { count: user.reviewCount })}
        </p>
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
          <PintIcon size={20} />

          <DescriptionList
            label={t("profilePage.uniqueBeers")}
            value={user.uniqueBeerCount}
          />
        </div>

        <div>
          <BreweryIcon size={20} />

          <DescriptionList
            label={t("profilePage.uniqueBreweries")}
            value={user.uniqueBreweryCount}
          />
        </div>

        <div>
          <StyleIcon size={20} />

          <DescriptionList
            label={t("profilePage.uniqueStyles")}
            value={user.uniqueStyleCount}
          />
        </div>

        <div>
          <WorldIcon size={20} />

          <DescriptionList
            label={t("profilePage.uniqueCountries")}
            value={user.uniqueCountryCount}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
