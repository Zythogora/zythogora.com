"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import Input from "@/app/_components/ui/input";
import { usePathname } from "@/lib/i18n";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { cn } from "@/lib/tailwind";

import type { ChangeEvent, FormEvent } from "react";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className }: SearchBarProps) => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <form
      onSubmit={handleSearchSubmit}
      className={cn("relative grow", className)}
    >
      <div className="absolute top-1/2 left-5 z-50 -translate-y-1/2">
        <SearchIcon size={24} className="text-foreground size-6" />
      </div>

      <Input
        defaultValue={searchParams.get("search") ?? undefined}
        onChange={handleSearchChange}
        placeholder={t("searchPage.searchBarPlaceholder")}
        className={cn(
          "before:rounded-full",
          "*:data-[slot=input]:rounded-full *:data-[slot=input]:pl-13",
        )}
      />
    </form>
  );
};

export default SearchBar;
