import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { useRef, useState, type ComponentProps } from "react";

import FileUpload from "@/app/_components/ui/file-upload";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

interface FormFileUploadProps extends Omit<
  ComponentProps<typeof FileUpload>,
  "onFileChange" | "onError"
> {
  label: string;
  field: FieldMetadata;
  className?: string;
  onCompression?: (isCompressing: boolean) => void;
}

const FormFileUpload = ({
  label,
  field,
  className,
  onCompression,
  ...restProps
}: FormFileUploadProps) => {
  const [errors, setErrors] = useState<string[] | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (inputRef.current) {
      // Update the input files
      const dataTransfer = new DataTransfer();
      if (file) {
        dataTransfer.items.add(file);
      }
      inputRef.current.files = dataTransfer.files;

      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const { name } = getInputProps(field, { type: "file" });

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        tabIndex={-1}
        className="absolute -z-1 size-0 opacity-0"
      />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <FileUpload
          onFileChange={handleFileChange}
          onError={setErrors}
          onCompression={onCompression}
          {...restProps}
        />

        <FormError
          id={field.errorId}
          errors={field.errors ? field.errors : errors}
        />
      </div>
    </div>
  );
};

export default FormFileUpload;
