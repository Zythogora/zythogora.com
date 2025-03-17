"use client";

import { useTranslations } from "next-intl";

import PintIcon from "@/app/_components/icons/pint";
import ReviewIcon from "@/app/_components/icons/review";
import { TabList, TabTrigger } from "@/app/_components/ui/tabs";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface BreweryTabListProps {
  brewerySlug: string;
}

const BreweryTabList = ({ brewerySlug }: BreweryTabListProps) => {
  const t = useTranslations();

  const router = useRouter();

  const handleTabChange = (tabName: string) => {
    router.replace(
      `${generatePath(Routes.BREWERY, { brewerySlug })}?tab=${tabName}`,
    );
  };

  return (
    <TabList>
      <TabTrigger
        value="beers"
        onClick={() => handleTabChange("beers")}
        className={cn(
          "**:data-[slot=path-foreground]:stroke-foreground **:data-[slot=path-foreground]:fill-transparent",
          "data-[state=active]:**:data-[slot=path-background]:fill-primary **:data-[slot=path-background]:fill-transparent",
        )}
      >
        <PintIcon size={16} className="size-4" />

        <span>{t("breweryPage.tabs.beers.title")}</span>
      </TabTrigger>

      <TabTrigger
        value="reviews"
        onClick={() => handleTabChange("reviews")}
        className={cn(
          "**:data-[slot=path-foreground]:fill-foreground",
          "data-[state=active]:**:data-[slot=path-background]:fill-primary **:data-[slot=path-background]:fill-transparent",
        )}
      >
        <ReviewIcon size={16} className="size-4" />

        <span>{t("breweryPage.tabs.reviews.title")}</span>
      </TabTrigger>
    </TabList>
  );
};

export default BreweryTabList;
