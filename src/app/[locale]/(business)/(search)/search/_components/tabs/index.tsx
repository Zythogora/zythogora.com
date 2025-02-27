"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SEARCH_KINDS } from "@/app/[locale]/(business)/(search)/search/types";
import Tab from "@/app/_components/ui/tab";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

import type { SearchKind } from "@/app/[locale]/(business)/(search)/search/types";

interface SearchTabsProps {
  defaultTab: SearchKind;
}

const SearchTabs = ({ defaultTab }: SearchTabsProps) => {
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? defaultTab;

  const handleTabClick = (tabKind: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("page");
    newSearchParams.set("kind", tabKind);

    router.push(`${Routes.SEARCH}?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex flex-row gap-x-3">
      {SEARCH_KINDS.map((tab) => (
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
