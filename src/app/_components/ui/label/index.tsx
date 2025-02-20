import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Label = ({
  className,
  ...restProps
}: ComponentProps<typeof LabelPrimitive.Root>) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "font-title pl-3 text-base font-medium select-none",
        "md:text-lg",
        "peer-disabled:pointer-events-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...restProps}
    />
  );
};

export default Label;
