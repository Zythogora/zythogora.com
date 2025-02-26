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
        "group-has-disabled/form-input:text-foreground-muted group-has-disabled/form-input:pointer-events-none group-has-disabled/form-input:cursor-not-allowed",
        className,
      )}
      {...restProps}
    />
  );
};

export default Label;
