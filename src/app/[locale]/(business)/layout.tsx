import { ThemeProvider } from "next-themes";

import OnboardingGuard from "@/app/_components/onboarding-guard";
import { availableThemes } from "@/app/_components/providers/theme-provider";
import { Toaster } from "@/app/_components/ui/sonner";

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
      <Toaster position="bottom-center" richColors />

      <OnboardingGuard />

      <div className="relative">{children}</div>
    </ThemeProvider>
  );
};

export default BusinessLayout;
