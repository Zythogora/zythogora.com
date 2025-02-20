"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Tab from "@/app/_components/ui/tab";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { Routes } from "@/lib/routes";

const TAB_KINDS = ["beers", "breweries"] as const;

interface SearchTabsProps {
  defaultTab: (typeof TAB_KINDS)[number];
}

const SearchTabs = ({ defaultTab }: SearchTabsProps) => {
  const t = useTranslations();

  const { push } = useRouterWithSearchParams();

  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? defaultTab;

  const handleTabClick = (tabKind: string) => {
    push(Routes.SEARCH, {
      ...Object.fromEntries(searchParams.entries()),
      kind: tabKind,
    });
  };

  return (
    <div className="flex flex-row gap-x-3">
      {TAB_KINDS.map((tab) => (
        <Tab
          key={tab}
          active={kind === tab}
          onClick={() => handleTabClick(tab)}
        >
          {t(`searchPage.${tab}.tabName`)}
        </Tab>
      ))}
    </div>
  );
};

export default SearchTabs;
