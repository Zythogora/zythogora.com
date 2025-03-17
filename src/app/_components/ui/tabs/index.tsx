"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Tabs = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-y-12", className)}
      {...restProps}
    />
  );
};

const TabList = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <div
      data-slot="tab-list-container"
      className={cn(
        "relative",
        "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5",
        "before:bg-foreground dark:before:bg-foreground/25",
        className,
      )}
    >
      <TabsPrimitive.List
        data-slot="tab-list"
        className="flex flex-row overflow-x-auto"
        {...restProps}
      />
    </div>
  );
};

const TabTrigger = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tab-trigger"
      className={cn(
        "font-title text-foreground flex cursor-pointer flex-row items-center justify-center gap-x-4 border-b-4 px-12 py-3 text-base text-nowrap",
        "hover:bg-foreground/10",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "focus-visible:-outline-offset-3",
        "data-[state=active]:border-b-primary border-b-transparent font-normal data-[state=active]:font-medium",
        className,
      )}
      {...restProps}
    />
  );
};

const TabContent = ({
  className,
  ...restProps
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tab-content"
      className={cn("outline-none", className)}
      {...restProps}
    />
  );
};

export { Tabs, TabContent, TabList, TabTrigger };
