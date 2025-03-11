import ThemeProvider from "@/app/_components/providers/theme-provider";
import { Toaster } from "@/app/_components/ui/sonner";

import type { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider forcedTheme="light" attribute="class">
      <Toaster forceTheme="light" position="bottom-center" richColors />

      <div className="flex h-screen flex-col">{children}</div>
    </ThemeProvider>
  );
};

export default AuthLayout;
