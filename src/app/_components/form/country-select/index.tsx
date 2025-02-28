import { getSelectProps, type FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import CountrySelect from "@/app/_components/ui/country-select";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

interface FormCountrySelectProps {
  label: string;
  field: FieldMetadata;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormCountrySelect = ({
  label,
  placeholder,
  searchPlaceholder,
  field,
  disabled,
  className,
}: FormCountrySelectProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      // Create and dispatch a change event to notify Conform
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [selectedCountryCode]);

  const { key, name, ...restSelectProps } = getSelectProps(field);

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        value={selectedCountryCode}
      />

      <Label htmlFor={field.id} required={field.required}>
        {label}
      </Label>

      <div>
        <CountrySelect
          {...restSelectProps}
          name={name}
          key={key}
          onChange={(value) => setSelectedCountryCode(value.code)}
          disabled={disabled}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormCountrySelect;
