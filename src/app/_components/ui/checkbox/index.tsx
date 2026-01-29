"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Checkbox = ({
  className,
  ...restProps
}: ComponentProps<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox border-foreground bg-background relative size-8 cursor-pointer rounded border-2",
        "dark:bg-stone-700",
        "data-[state=checked]:bg-primary data-[state=checked]:text-foreground",
        "dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-stone-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:disabled:text-foreground!",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "dark:aria-invalid:ring-destructive/40",
        "before:bg-background before:border-foreground before:absolute before:-inset-0.5 before:z-[-1] before:rounded before:border-2 before:drop-shadow",
        className,
      )}
      {...restProps}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center"
      >
        <CheckIcon className={cn("size-5 stroke-[2.5]", "dark:stroke-[3.5]")} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export default Checkbox;
