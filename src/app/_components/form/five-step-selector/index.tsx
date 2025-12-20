"use client";

import { getInputProps } from "@conform-to/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ComponentProps } from "react";

import FiveStepSelector from "@/app/_components/ui/five-step-selector";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormFiveStepSelectorProps extends ComponentProps<
  typeof FiveStepSelector
> {
  field: FieldMetadata;
  group: "overall" | "appearance" | "nose" | "taste" | "finish";
  possibleValues: readonly [string, string, string, string, string];
  className?: string;
}

const FormFiveStepSelector = ({
  field,
  group,
  possibleValues,
  className,
  ...restProps
}: FormFiveStepSelectorProps) => {
  const t = useTranslations();

  const [selectedValue, setSelectedValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedValue]);

  const { key, name, ...restInputProps } = getInputProps(field, {
    type: "number",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, value, type, ...ariaInputProps } = restInputProps;

  return (
    <div
      className={cn(
        "group/form-component",
        "flex w-full flex-col gap-y-1",
        className,
      )}
    >
      <input ref={inputRef} type="hidden" name={name} value={selectedValue} />

      <Label htmlFor={field.id} required={field.required}>
        {selectedValue
          ? `${t(`reviewPage.${group}.fields.${field.name}.label`)}: ${t(
              `reviewPage.${group}.fields.${field.name}.possibleValues.${selectedValue}`,
            )}`
          : t(`reviewPage.${group}.fields.${field.name}.label`)}
      </Label>

      <div className="w-full">
        <FiveStepSelector
          key={key}
          {...ariaInputProps}
          {...restProps}
          onValueChange={(value) => setSelectedValue(possibleValues[value]!)}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormFiveStepSelector;
