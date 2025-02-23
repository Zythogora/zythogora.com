import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Chip = ({ className, children, ...restProps }: ComponentProps<"p">) => {
  return (
    <p
      className={cn(
        "bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1 text-xs",
        className,
      )}
      {...restProps}
    >
      {children}
    </p>
  );
};

export default Chip;
