"use client";

import { getInputProps } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import DatePicker from "@/app/_components/ui/date-picker";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormDatePickerProps {
  label: string;
  field: FieldMetadata;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormDatePicker = ({
  label,
  field,
  placeholder,
  disabled,
  className,
}: FormDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedDate]);

  const { key, name, ...restInputProps } = getInputProps(field, {
    type: "date",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, value, ...ariaInputProps } = restInputProps;

  return (
    <div
      className={cn(
        "group/form-component",
        "flex w-full flex-col gap-y-1",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        value={selectedDate ? selectedDate.toISOString() : ""}
      />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <DatePicker
          key={key}
          value={selectedDate}
          onChange={setSelectedDate}
          disabled={disabled}
          placeholder={placeholder}
          {...ariaInputProps}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormDatePicker;
