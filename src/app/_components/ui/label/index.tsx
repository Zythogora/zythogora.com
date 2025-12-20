import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

interface LabelProps extends ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

const Label = ({
  className,
  required = false,
  children,
  ...restProps
}: LabelProps) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "font-title relative pl-3 text-base select-none",
        "md:text-lg",
        "group-has-disabled/form-component:text-foreground-muted group-has-disabled/form-component:pointer-events-none group-has-disabled/form-component:cursor-not-allowed",
        className,
      )}
      {...restProps}
    >
      {required ? (
        <span className="text-destructive absolute left-0">*</span>
      ) : null}

      <span className="font-medium">{children}</span>
    </LabelPrimitive.Root>
  );
};

export default Label;
