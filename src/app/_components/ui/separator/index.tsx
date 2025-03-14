import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

function Separator({
  className,
  decorative = true,
  ...restProps
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      className={cn(
        "bg-foreground/10 shrink-0",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...restProps}
    />
  );
}

export { Separator };
