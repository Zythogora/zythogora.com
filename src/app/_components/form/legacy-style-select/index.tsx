"use client";

import { getSelectProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import LegacyStyleSelect from "@/app/_components/form/legacy-style-select/style-select";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { LegacyStyle } from "@/domain/beers/types";

interface FormLegacyStyleSelectProps {
  label: string;
  field: FieldMetadata;
  styles: LegacyStyle[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormLegacyStyleSelect = ({
  label,
  field,
  styles,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: FormLegacyStyleSelectProps) => {
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
        <LegacyStyleSelect
          {...restSelectProps}
          name={name}
          key={key}
          styles={styles}
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

export default FormLegacyStyleSelect;
