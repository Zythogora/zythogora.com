import { Suspense, type PropsWithChildren } from "react";

import SearchBar, { SearchBarClient } from "@/app/_components/search-bar";

const SearchLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <div className="border-foreground flex w-full flex-row items-center gap-x-6 border-b bg-stone-50 px-8 py-6 drop-shadow dark:bg-stone-900">
        <Suspense fallback={<SearchBar />}>
          <SearchBarClient />
        </Suspense>
      </div>

      <div className="flex flex-col p-8">{children}</div>
    </div>
  );
};

export default SearchLayout;
