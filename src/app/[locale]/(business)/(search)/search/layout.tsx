import { Suspense, type PropsWithChildren } from "react";

import SearchTabs from "@/app/[locale]/(business)/(search)/search/_components/tabs";
import SearchBar, { SearchBarClient } from "@/app/_components/search-bar";
import UserMenu, { UserMenuTrigger } from "@/app/_components/user-menu";

const SearchLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <div className="border-foreground flex w-full flex-col gap-y-4 border-b bg-stone-50 px-8 py-6 drop-shadow dark:bg-stone-900">
        <div className="flex flex-row items-center gap-x-6">
          <Suspense fallback={<SearchBar />}>
            <SearchBarClient />
          </Suspense>

          <Suspense fallback={<UserMenuTrigger disabled />}>
            <UserMenu />
          </Suspense>
        </div>

        <SearchTabs defaultTab="beer" />
      </div>

      <div className="flex flex-col p-8">{children}</div>
    </div>
  );
};

export default SearchLayout;
