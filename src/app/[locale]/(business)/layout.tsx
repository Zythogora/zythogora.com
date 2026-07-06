import OnboardingGuard from "@/app/_components/onboarding-guard";
import { Toaster } from "@/app/_components/ui/sonner";

import type { PropsWithChildren } from "react";

const BusinessLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Toaster position="bottom-center" richColors />

      <OnboardingGuard />

      <div className="relative">{children}</div>
    </>
  );
};

export default BusinessLayout;
