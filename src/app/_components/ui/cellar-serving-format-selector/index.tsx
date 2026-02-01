import { RadioGroup } from "radix-ui";

import { ServingFrom } from "@db/enums";

import ServingFromBottleIcon from "@/app/_components/icons/serving-from/bottle";
import ServingFromCanIcon from "@/app/_components/icons/serving-from/can";
import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

export const cellarServingFormatValues = [
  ServingFrom.BOTTLE,
  ServingFrom.CAN,
] as const;

export type CellarServingFormat = (typeof cellarServingFormatValues)[number];

interface CellarServingFormatIconProps {
  size: number;
  type: CellarServingFormat;
  className?: string;
}

const CellarServingFormatIcon = ({
  size,
  type,
  className,
}: CellarServingFormatIconProps) => {
  switch (type) {
    case ServingFrom.BOTTLE:
      return (
        <ServingFromBottleIcon
          size={size}
          className={cn(
            "stroke-foreground stroke-[0.375px]",
            "group-data-[state=checked]/cellar-serving-format-item:stroke-stone-950",
            className,
          )}
        />
      );
    case ServingFrom.CAN:
      return (
        <ServingFromCanIcon
          size={size}
          className={cn(
            "stroke-foreground stroke-[0.375px]",
            "group-data-[state=checked]/cellar-serving-format-item:stroke-stone-950",
            className,
          )}
        />
      );
  }
};

interface CellarServingFormatSelectorProps
  extends ComponentProps<typeof RadioGroup.Root> {
  className?: string;
}

const CellarServingFormatSelector = ({
  className,
  ...restProps
}: CellarServingFormatSelectorProps) => {
  return (
    <RadioGroup.Root
      data-slot="selector"
      loop={false}
      className={cn(
        "grid grid-cols-2 rounded *:-mx-px",
        "bg-background dark:bg-stone-700",
        "has-focus-visible:outline-3!",
        "has-focus-visible:outline-primary-700! dark:has-focus-visible:outline-primary-100!",
        className,
      )}
      {...restProps}
    >
      {cellarServingFormatValues.map((value) => (
        <RadioGroup.Item
          key={value}
          value={value}
          className={cn(
            "group/cellar-serving-format-item",
            "border-foreground relative flex items-center justify-center border-2 px-4",
            "py-4 @3xl:py-6",
            "before:bg-foreground before:absolute before:-inset-x-0.5 before:top-0 before:-bottom-1 before:z-[-2]",
            "first-of-type:rounded-l last-of-type:rounded-r",
            "first-of-type:before:rounded-l last-of-type:before:rounded-r",
            "data-[state=checked]:bg-primary data-[state=checked]:-bottom-0.5 data-[state=checked]:before:hidden",
            "focus-visible:bottom-0! focus-visible:z-50",
            "focus-visible:before:hidden",
          )}
        >
          <CellarServingFormatIcon
            size={32}
            type={value}
            className={cn(
              "fill-foreground overflow-visible",
              "size-8 @3xl:size-10",
              "group-data-[state=checked]/cellar-serving-format-item:fill-stone-950",
            )}
          />

          <RadioGroup.Indicator className="sr-only" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default CellarServingFormatSelector;
