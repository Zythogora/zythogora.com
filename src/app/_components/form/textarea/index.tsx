"use client";

import { getTextareaProps, type FieldMetadata } from "@conform-to/react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import Textarea from "@/app/_components/ui/textarea";
import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

interface FormTextareaProps
  extends Pick<
    ComponentProps<typeof Textarea>,
    "placeholder" | "disabled" | "rows" | "className"
  > {
  label: string;
  field: FieldMetadata;
}

const FormTextarea = ({
  label,
  field,
  className,
  ...restProps
}: FormTextareaProps) => {
  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <Textarea
          {...getTextareaProps(field, { ariaAttributes: true })}
          key={field.key}
          {...restProps}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormTextarea;
