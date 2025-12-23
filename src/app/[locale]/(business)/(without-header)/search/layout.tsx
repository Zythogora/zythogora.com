import SearchTabs from "@/app/[locale]/(business)/(without-header)/search/_components/tabs";
import SearchBar from "@/app/_components/search-bar";
import UserMenu from "@/app/_components/user-menu";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import type { PropsWithChildren } from "react";

const SearchLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "border-foreground grid w-full items-center gap-x-6 gap-y-4 border-b px-8 py-6 drop-shadow",
          "bg-stone-50 dark:bg-stone-900",
          "grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[1fr_calc(var(--spacing)*224)_1fr]",
        )}
      >
        <Link
          href={Routes.HOME}
          className={cn(
            "font-title text-2xl font-semibold tracking-wide uppercase",
            "hidden lg:block",
            "invisible w-0 xl:visible xl:w-fit",
          )}
        >
          <span>Zythogora</span>
        </Link>

        <SearchBar className="w-4xl max-w-full" />

        <UserMenu className="lg:justify-self-end" />

        <SearchTabs
          defaultTab="beer"
          className="w-4xl max-w-full lg:col-start-2"
        />
      </div>

      <div
        className={cn(
          "flex w-4xl max-w-full flex-col gap-y-4 p-8",
          "**:[&_a]:focus-within:outline-primary **:[&_a]:rounded-xs **:[&_a]:focus-within:outline-3 **:[&_a]:focus-within:outline-offset-4",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SearchLayout;
