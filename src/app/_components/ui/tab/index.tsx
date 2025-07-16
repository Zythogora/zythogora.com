import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

interface TabProps extends ComponentProps<"button"> {
  active?: boolean;
}

const Tab = ({
  active = false,
  children,
  className,
  ...restProps
}: TabProps) => {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2.5 text-sm focus-visible:ring-0 focus-visible:outline-none",
        active
          ? "bg-background border-2 drop-shadow focus-visible:bg-stone-200"
          : "hover:inset-shadow focus-visible:inset-shadow cursor-pointer bg-stone-300 dark:bg-stone-600",
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Tab;
