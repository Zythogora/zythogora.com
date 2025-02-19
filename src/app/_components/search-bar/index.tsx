"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import Input from "@/app/_components/ui/input";
import { usePathname } from "@/lib/i18n";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";

import type { ChangeEvent, FormEvent } from "react";

interface SearchBarProps {
  initialValue?: string;
}

const SearchBar = ({ initialValue }: SearchBarProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const { push } = useRouterWithSearchParams();

  const debouncedSearch = useDebouncedCallback(
    (search: string) => push(pathname, { search }),
    300,
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    debouncedSearch.flush();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="grow">
      <Input
        defaultValue={initialValue}
        onChange={handleSearchChange}
        placeholder={t("searchPage.searchBarPlaceholder")}
        containerClassName="before:rounded-full"
        className="rounded-full"
      />
    </form>
  );
};

export const SearchBarClient = () => {
  const searchParams = useSearchParams();

  return <SearchBar initialValue={searchParams.get("search") ?? undefined} />;
};

export default SearchBar;
