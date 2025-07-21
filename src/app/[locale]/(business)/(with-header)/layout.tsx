import Header from "@/app/[locale]/(business)/(with-header)/_components/header";
import QueryClientProvider from "@/app/_components/providers/query-client-provider";
import { cn } from "@/lib/tailwind";

import type { PropsWithChildren } from "react";

const AppWithHeaderLayout = async ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div
          className={cn(
            "flex grow flex-col items-center",
            "dark:bg-background bg-stone-100",
            "pb-10",
            "md:px-16 md:py-12",
          )}
        >
          <div className="flex w-192 max-w-full flex-col">{children}</div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AppWithHeaderLayout;
