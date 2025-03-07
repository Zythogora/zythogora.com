"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { Fragment, useMemo, useState } from "react";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";
import type { CSSProperties } from "react";

interface FiveStepSelectorProps
  extends Omit<
    ComponentProps<typeof RadioGroup.Root>,
    "value" | "defaultValue" | "onValueChange"
  > {
  onValueChange?: (value: number) => void;
  className?: string;
}

const FiveStepSelector = ({
  className,
  onValueChange,
  ...restProps
}: FiveStepSelectorProps) => {
  const possibleValues = useMemo(() => [...Array(5)].map((_, i) => i), []);

  const [selectedValue, setSelectedValue] = useState<number | undefined>();

  const handleValueChange = (value: string) => {
    const parsedValue = Number(value);
    setSelectedValue(parsedValue);
    onValueChange?.(parsedValue);
  };

  return (
    <RadioGroup.Root
      data-slot="selector"
      {...restProps}
      value={`${selectedValue}`}
      onValueChange={handleValueChange}
      loop={false}
      className={cn(
        "border-foreground relative flex h-12 w-full grow touch-none items-center justify-between gap-x-2 rounded-full border-2 p-3 pl-5 select-none",
        "bg-background dark:bg-stone-700",
        "data-[disabled]:opacity-50",
        "before:bg-foreground before:absolute before:inset-0 before:-bottom-1 before:z-[-1] before:rounded-full",
        "has-focus-visible:outline-primary! has-focus-visible:outline-3!",
        className,
      )}
    >
      {possibleValues.map((possibleValue, index) => (
        <Fragment key={possibleValue}>
          <RadioGroup.Item
            value={possibleValue.toString()}
            data-progress-checked={
              selectedValue ? possibleValue <= selectedValue : false
            }
            className={cn(
              "size-[calc(theme(spacing.2)+theme(spacing.1)*var(--selector-step-index))] shrink-0 cursor-pointer rounded-full",
              "bg-foreground/10 data-[state=checked]:bg-primary data-[progress-checked=true]:bg-primary",
              "hover:outline-foreground hover:outline-3",
              "focus-visible:outline-foreground focus-visible:outline-3",
              "data-[state=checked]:outline-foreground data-[state=checked]:outline-3",
            )}
            style={
              {
                "--selector-step-index": index,
              } as CSSProperties
            }
          >
            <RadioGroup.Indicator className="sr-only" />
          </RadioGroup.Item>

          {index < possibleValues.length - 1 ? (
            <div
              data-progress-checked={
                selectedValue ? possibleValue <= selectedValue - 1 : false
              }
              className={cn(
                "h-[calc(2px+0.75px*var(--selector-separator-index))] grow rounded-full",
                "data-[progress-checked=false]:bg-foreground/10 from-transparent to-transparent data-[progress-checked=true]:bg-gradient-to-r",
              )}
              style={
                {
                  "--tw-gradient-from": `color-mix(in oklab, var(--primary) ${
                    (index / (possibleValues.length - 1)) * 100
                  }%, transparent)`,
                  "--tw-gradient-to": `color-mix(in oklab, var(--primary) ${
                    ((index + 1) / (possibleValues.length - 1)) * 100
                  }%, transparent)`,
                  "--selector-separator-index": index,
                } as CSSProperties
              }
            />
          ) : null}
        </Fragment>
      ))}
    </RadioGroup.Root>
  );
};

export default FiveStepSelector;
