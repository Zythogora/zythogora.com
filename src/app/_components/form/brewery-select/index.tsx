"use client";

import { getSelectProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import BrewerySelect from "@/app/_components/ui/brewery-select";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

interface FormBrewerySelectProps {
  label: string;
  field: FieldMetadata;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormBrewerySelect = ({
  label,
  field,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: FormBrewerySelectProps) => {
  const [selectedBreweryId, setSelectedBreweryId] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedBreweryId]);

  const { key, name, ...restSelectProps } = getSelectProps(field);

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        value={selectedBreweryId}
      />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <BrewerySelect
          {...restSelectProps}
          name={name}
          key={key}
          onChange={(value) => setSelectedBreweryId(value.id)}
          disabled={disabled}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormBrewerySelect;
