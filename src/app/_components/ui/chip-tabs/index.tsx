"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const ChipTabs = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="chip-tabs"
      className={cn("flex flex-col gap-y-6", className)}
      {...restProps}
    />
  );
};

const ChipTabList = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      data-slot="chip-tab-list"
      className={cn(
        "flex max-w-full flex-row gap-x-3 overflow-x-auto",
        className,
      )}
      {...restProps}
    />
  );
};

const ChipTabTrigger = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="chip-tab-trigger"
      className={cn(
        "rounded-full px-4 py-2.5 text-xs text-nowrap ring-0 outline-none",
        "bg-stone-300 data-[state=active]:bg-stone-50 dark:bg-stone-500 dark:data-[state=active]:bg-stone-700",
        "not-data-[state=active]:cursor-pointer",
        "hover:inset-shadow not-data-[state=active]:hover:inset-shadow-primary data-[state=active]:focus-visible:inset-shadow-primary",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "data-[state=active]:inset-shadow",
        className,
      )}
      {...restProps}
    />
  );
};

const ChipTabContent = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="chip-tab-content"
      className={cn("outline-none", className)}
      {...restProps}
    />
  );
};

export { ChipTabs, ChipTabContent, ChipTabList, ChipTabTrigger };
