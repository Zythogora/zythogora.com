"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { useMemo } from "react";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

type BaseSliderProps = ComponentProps<typeof SliderPrimitive.Root>;

interface SliderProps
  extends Omit<BaseSliderProps, "min" | "max" | "step">,
    Required<Pick<BaseSliderProps, "min" | "max" | "step">> {}

const Slider = ({ className, ...restProps }: SliderProps) => {
  const possibleValues = useMemo(
    () =>
      [...Array((restProps.max - restProps.min) / restProps.step + 1)].map(
        (_, i) => i,
      ),
    [restProps],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      {...restProps}
      className={cn(
        "border-foreground relative flex h-12 w-full grow cursor-pointer touch-none items-center rounded-full border-2 p-0.5 select-none",
        "bg-background dark:bg-stone-700",
        "data-[disabled]:opacity-50",
        "before:bg-foreground before:absolute before:inset-0 before:-bottom-1 before:z-[-1] before:rounded-full",
        "focus-within:outline-primary focus-within:outline-3",
        className,
      )}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative size-full overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="@container/slider-range absolute h-full"
        >
          <div className="bg-primary size-full rounded-r-[50%] @min-[theme(spacing.12)]/slider-range:rounded-r-full" />
        </SliderPrimitive.Range>

        <div
          className="absolute inset-0 flex items-center justify-between"
          aria-hidden="true"
        >
          {possibleValues.map((_, i) => (
            <div
              key={i}
              className={cn(
                "bg-foreground w-0.5 rounded-full",
                "odd:h-3 even:h-1.5",
                "first-of-type:opacity-0 last-of-type:opacity-0",
              )}
            />
          ))}
        </div>
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb data-slot="slider-thumb" className="sr-only" />
    </SliderPrimitive.Root>
  );
};

export default Slider;
