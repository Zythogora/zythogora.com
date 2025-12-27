"use client";

import { getSelectProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import StyleSelect from "@/app/_components/ui/style-select";
import type { StyleCategory } from "@/domain/beers/types";
import { cn } from "@/lib/tailwind";

interface FormStyleSelectProps {
  label: string;
  field: FieldMetadata;
  styleCategories: StyleCategory[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormStyleSelect = ({
  label,
  field,
  styleCategories,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: FormStyleSelectProps) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedStyleId]);

  const { key, name, ...restSelectProps } = getSelectProps(field);

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input ref={inputRef} type="hidden" name={name} value={selectedStyleId} />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <StyleSelect
          {...restSelectProps}
          name={name}
          key={key}
          popoverId={`${field.id}-popover`}
          styleCategories={styleCategories}
          onChange={(value) => setSelectedStyleId(value.id)}
          disabled={disabled}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormStyleSelect;
