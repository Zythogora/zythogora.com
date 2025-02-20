import { getInputProps, type FieldMetadata } from "@conform-to/react";

import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";

interface FormInputProps {
  label: string;
  placeholder: string;
  type: Parameters<typeof getInputProps>[1]["type"];
  field: FieldMetadata;
  disabled?: boolean;
  className?: {
    label?: string;
    input?: string;
    inputContainer?: string;
    error?: string;
  };
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
    <div className="flex flex-col gap-y-1">
      <Label htmlFor={field.id} className={className?.label}>
        {label}
      </Label>

      <div>
        <Input
          {...getInputProps(field, { ariaAttributes: true, type })}
          key={field.key}
          disabled={disabled}
          placeholder={placeholder}
          className={className?.input}
          containerClassName={className?.inputContainer}
        />

        <FormError
          id={field.errorId}
          errors={field.errors}
          className={className?.error}
        />
      </div>
    </div>
  );
};

export default FormInput;
