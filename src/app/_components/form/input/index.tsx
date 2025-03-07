"use client";
import { getInputProps } from "@conform-to/react";

import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormInputProps {
  label: string;
  type: Parameters<typeof getInputProps>[1]["type"];
  field: FieldMetadata;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormInput = ({
  label,
  type,
  field,
  placeholder,
  disabled,
  className,
}: FormInputProps) => {
  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <Input
          {...getInputProps(field, { type, ariaAttributes: true })}
          key={field.key}
          disabled={disabled}
          placeholder={placeholder}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormInput;
