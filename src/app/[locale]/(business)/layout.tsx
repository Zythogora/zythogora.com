import LocaleSwitcher from "@/app/_components/locale-switcher";
import ThemeSwitcher from "@/app/_components/theme-switcher";

import type { PropsWithChildren } from "react";

const BusinessLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative">
      <LocaleSwitcher />

      <ThemeSwitcher />

      {children}
    </div>
  );
};

export default BusinessLayout;
