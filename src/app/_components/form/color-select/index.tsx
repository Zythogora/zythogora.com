"use client";

import { getSelectProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import ColorSelect from "@/app/_components/ui/color-select";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { Color } from "@/domain/beers/types";

interface FormColorSelectProps {
  label: string;
  field: FieldMetadata;
  colors: Color[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormColorSelect = ({
  label,
  field,
  colors,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: FormColorSelectProps) => {
  const [selectedColorId, setSelectedColorId] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedColorId]);

  const { key, name, ...restSelectProps } = getSelectProps(field);

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input ref={inputRef} type="hidden" name={name} value={selectedColorId} />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <ColorSelect
          {...restSelectProps}
          name={name}
          key={key}
          colors={colors}
          onChange={(value) => setSelectedColorId(value.id)}
          disabled={disabled}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormColorSelect;
