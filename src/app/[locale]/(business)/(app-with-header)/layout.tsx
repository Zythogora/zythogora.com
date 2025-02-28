import Header from "@/app/[locale]/(business)/(app-with-header)/_components/header";
import QueryClientProvider from "@/app/_components/providers/query-client-provider";

import type { PropsWithChildren } from "react";

const AppWithHeaderLayout = async ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider>
      <div className="flex flex-col">
        <Header />

        <div className="flex flex-col gap-y-8 p-8">{children}</div>
      </div>
    </QueryClientProvider>
  );
};

export default AppWithHeaderLayout;
