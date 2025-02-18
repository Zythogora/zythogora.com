import { ThemeProvider } from "next-themes";

import LocaleSwitcher from "@/app/_components/locale-switcher";
import { availableThemes } from "@/app/_components/providers/theme-provider";
import ThemeSwitcher from "@/app/_components/theme-switcher";

import type { PropsWithChildren } from "react";

const BusinessLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
      attribute="class"
      themes={availableThemes as unknown as string[]}
      disableTransitionOnChange
    >
      <div className="relative">
        <LocaleSwitcher />

        <ThemeSwitcher />

        {children}
      </div>
    </ThemeProvider>
  );
};

export default BusinessLayout;
