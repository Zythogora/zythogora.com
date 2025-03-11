import * as RadioGroup from "@radix-ui/react-radio-group";

import { servingFromValues } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import ServingFromBottleIcon from "@/app/_components/icons/serving-from/bottle";
import ServingFromCanIcon from "@/app/_components/icons/serving-from/can";
import ServingFromCaskIcon from "@/app/_components/icons/serving-from/cask";
import ServingFromDraftIcon from "@/app/_components/icons/serving-from/draft";
import ServingFromGrowlerIcon from "@/app/_components/icons/serving-from/growler";
import { cn } from "@/lib/tailwind";
import { exhaustiveCheck } from "@/lib/typescript/utils";

import type { ComponentProps } from "react";

interface ServingFromIconProps {
  size: number;
  type: (typeof servingFromValues)[number];
  className?: string;
}

const ServingFromIcon = ({ size, type, className }: ServingFromIconProps) => {
  switch (type) {
    case "draft":
      return <ServingFromDraftIcon size={size} className={className} />;
    case "bottle":
      return (
        <ServingFromBottleIcon
          size={size}
          className={cn(
            "stroke-foreground stroke-[0.375px]",
            "group-data-[state=checked]/serving-from-item:stroke-stone-950",
            className,
          )}
        />
      );
    case "can":
      return (
        <ServingFromCanIcon
          size={size}
          className={cn(
            "stroke-foreground stroke-[0.375px]",
            "group-data-[state=checked]/serving-from-item:stroke-stone-950",
            className,
          )}
        />
      );
    case "growler":
      return (
        <ServingFromGrowlerIcon
          size={size}
          className={cn(
            "stroke-foreground stroke-[0.25px]",
            "group-data-[state=checked]/serving-from-item:stroke-stone-950",
            className,
          )}
        />
      );
    case "cask":
      return <ServingFromCaskIcon size={size} className={className} />;
    default:
      exhaustiveCheck({ value: type, error: "Invalid serving from value" });
  }
};

interface ServingFromSelectorProps
  extends ComponentProps<typeof RadioGroup.Root> {
  className?: string;
}

const ServingFromSelector = ({
  className,
  ...restProps
}: ServingFromSelectorProps) => {
  return (
    <RadioGroup.Root
      data-slot="selector"
      loop={false}
      className={cn(
        "grid grid-cols-5 rounded *:-mx-px",
        "bg-background dark:bg-stone-700",
        "has-focus-visible:outline-3!",
        "has-focus-visible:outline-primary-700! dark:has-focus-visible:outline-primary-100!",
        className,
      )}
      {...restProps}
    >
      {servingFromValues.map((value) => (
        <RadioGroup.Item
          key={value}
          value={value}
          className={cn(
            "group/serving-from-item",
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
          <ServingFromIcon
            size={32}
            type={value}
            className={cn(
              "fill-foreground overflow-visible",
              "size-8 @3xl:size-10",
              "group-data-[state=checked]/serving-from-item:fill-stone-950",
            )}
          />

          <RadioGroup.Indicator className="sr-only" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default ServingFromSelector;
