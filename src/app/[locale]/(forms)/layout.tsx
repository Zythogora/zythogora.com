import { ThemeProvider } from "next-themes";

import { availableThemes } from "@/app/_components/providers/theme-provider";

import type { PropsWithChildren } from "react";

const FormsLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
      attribute="class"
      themes={availableThemes as unknown as string[]}
      disableTransitionOnChange
    >
      <div className="relative">{children}</div>
    </ThemeProvider>
  );
};

export default FormsLayout;
