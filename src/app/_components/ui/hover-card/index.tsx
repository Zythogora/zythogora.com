"use client";

import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const HoverCard = (props: ComponentProps<typeof HoverCardPrimitive.Root>) => {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
};

const HoverCardTrigger = (
  props: ComponentProps<typeof HoverCardPrimitive.Trigger>,
) => {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
};

const HoverCardContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...restProps
}: ComponentProps<typeof HoverCardPrimitive.Content>) => {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-background text-popover-foreground z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
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
    </HoverCardPrimitive.Portal>
  );
};

export { HoverCard, HoverCardTrigger, HoverCardContent };
