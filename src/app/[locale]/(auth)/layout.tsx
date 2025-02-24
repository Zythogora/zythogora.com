import { Toaster } from "@/app/_components/ui/sonner";

import type { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Toaster forceTheme="light" position="bottom-center" richColors />

      <div className="flex h-screen flex-col">{children}</div>
    </>
  );
};

export default AuthLayout;
