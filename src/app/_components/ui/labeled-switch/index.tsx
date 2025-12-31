"use client";

import { Label, RadioGroup } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const LabeledSwitch = ({
  className,
  ...restProps
}: ComponentProps<typeof RadioGroup.Root>) => {
  return (
    <RadioGroup.Root
      data-slot="labeled-switches"
      className={cn(
        "bg-foreground/10 grid w-fit items-center rounded-full",
        "grid-cols-[auto_auto] md:grid-cols-2",
        className,
      )}
      {...restProps}
    />
  );
};

const LabeledSwitchItem = ({
  value,
  children,
  className,
  ...restProps
}: Omit<ComponentProps<typeof RadioGroup.Item>, "id">) => {
  return (
    <RadioGroup.Item
      id={value}
      value={value}
      data-slot="labeled-switch"
      className="group/labeled-switch flex rounded-full"
      {...restProps}
    >
      <RadioGroup.Indicator
        data-slot="labeled-switch-indicator"
        className="sr-only"
      />

      <Label.Root
        data-slot="labeled-switch-label"
        htmlFor={value}
        className={cn(
          "flex-1 border-2 border-transparent text-center text-sm",
          "px-2 py-1.5 md:px-4 md:py-0.5",
          "group-data-[state=checked]/labeled-switch:bg-background group-data-[state=checked]/labeled-switch:border-foreground group-data-[state=checked]/labeled-switch:relative group-data-[state=checked]/labeled-switch:bottom-px group-data-[state=checked]/labeled-switch:rounded-full group-data-[state=checked]/labeled-switch:drop-shadow",
          className,
        )}
      >
        {children}
      </Label.Root>
    </RadioGroup.Item>
  );
};

export { LabeledSwitch, LabeledSwitchItem };
