"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import {
  LabeledSwitch,
  LabeledSwitchItem,
} from "@/app/_components/ui/labeled-switch";
import { cn } from "@/lib/tailwind";

interface FormLabeledSwitchProps {
  label: string;
  field: FieldMetadata<string>;
  items: [{ value: string; label: string }, { value: string; label: string }];
  disabled?: boolean;
  className?: string;
}

const FormLabeledSwitch = ({
  label,
  field,
  items,
  disabled,
  className,
}: FormLabeledSwitchProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    field.value ?? field.defaultValue ?? items[0].value,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedValue]);

  const { name, ...restInputProps } = getInputProps(field, {
    type: "text",
    ariaAttributes: true,
  });

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input ref={inputRef} type="hidden" name={name} value={selectedValue} />

      <div className="flex flex-row items-center justify-between gap-x-3 md:justify-start">
        <Label htmlFor={field.id} required={field.required}>
          {label}
        </Label>

        <LabeledSwitch
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value)}
          disabled={disabled}
          {...restInputProps}
        >
          {items.map((item) => (
            <LabeledSwitchItem key={item.value} value={item.value}>
              {item.label}
            </LabeledSwitchItem>
          ))}
        </LabeledSwitch>
      </div>

      <FormError id={field.errorId} errors={field.errors} />
    </div>
  );
};

export default FormLabeledSwitch;
