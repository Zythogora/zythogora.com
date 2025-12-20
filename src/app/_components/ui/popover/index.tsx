"use client";

import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Popover = (props: ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
};

const PopoverTrigger = (
  props: ComponentProps<typeof PopoverPrimitive.Trigger>,
) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
};

const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...restProps
}: ComponentProps<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-background border-foreground z-50 w-72 rounded border-2 p-4 outline-hidden drop-shadow",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...restProps}
      />
    </PopoverPrimitive.Portal>
  );
};

const PopoverAnchor = (
  props: ComponentProps<typeof PopoverPrimitive.Anchor>,
) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
