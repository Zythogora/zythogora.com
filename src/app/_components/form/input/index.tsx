import { getInputProps, type FieldMetadata } from "@conform-to/react";

import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

interface FormInputProps {
  label: string;
  placeholder: string;
  type: Parameters<typeof getInputProps>[1]["type"];
  field: FieldMetadata;
  disabled?: boolean;
  className?: string;
}

const FormInput = ({
  label,
  placeholder,
  type,
  field,
  disabled,
  className,
}: FormInputProps) => {
  return (
    <div className={cn("group/form-input", "flex flex-col gap-y-1", className)}>
      <Label htmlFor={field.id}>{label}</Label>

      <div>
        <Input
          {...getInputProps(field, { ariaAttributes: true, type })}
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
