import { cn } from "@/lib/tailwind";

import type { PropsWithChildren } from "react";

interface ChipProps {
  className?: string;
}

const Chip = ({ className, children }: PropsWithChildren<ChipProps>) => {
  return (
    <p
      className={cn(
        "bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1 text-xs",
        className,
      )}
    >
      {children}
    </p>
  );
};

export default Chip;
