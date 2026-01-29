"use client";
import { getInputProps } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import Checkbox from "@/app/_components/ui/checkbox";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormCheckboxProps {
  label: string;
  field: FieldMetadata;
  disabled?: boolean;
  className?: string;
}

const FormCheckbox = ({
  label,
  field,
  disabled,
  className,
}: FormCheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(
    field.value === "on" || field.value === true,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [checked]);

  const { name, ...restInputProps } = getInputProps(field, {
    type: "checkbox",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, type, ...ariaInputProps } = restInputProps;

  return (
    <div className={cn("group/form-component", "flex items-center", className)}>
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        value={checked ? "on" : ""}
      />

      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(isChecked) => setChecked(isChecked === true)}
        {...ariaInputProps}
      />

      <Label
        htmlFor={field.id}
        required={field.required}
        className="cursor-pointer pl-4"
      >
        {label}
      </Label>

      <FormError id={field.errorId} errors={field.errors} />
    </div>
  );
};

export default FormCheckbox;
