"use client";

import { getInputProps } from "@conform-to/react";
import { useState } from "react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import Slider from "@/app/_components/ui/slider";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";
import type { ComponentProps } from "react";

interface FormSliderProps extends ComponentProps<typeof Slider> {
  label: string;
  field: FieldMetadata;
}

const FormSlider = ({
  label,
  field,
  className,
  ...restProps
}: FormSliderProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    restProps.defaultValue && restProps.defaultValue.length > 0
      ? restProps.defaultValue[0]!.toString()
      : undefined,
  );

  const { key, name, ...restInputProps } = getInputProps(field, {
    type: "range",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, value, min, max, step, type, ...ariaInputProps } =
    restInputProps;

  return (
    <div
      className={cn(
        "group/form-component",
        "flex w-full flex-col gap-y-1",
        className,
      )}
    >
      <Label htmlFor={field.id} required={field.required}>
        {`${label}: ${selectedValue}/${max}`}
      </Label>

      <div className="w-full">
        <Slider
          {...ariaInputProps}
          {...restProps}
          name={name}
          key={key}
          onValueChange={(value) => setSelectedValue(value[0]?.toString())}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormSlider;
