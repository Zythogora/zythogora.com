"use client";

import {
  getInputProps,
  getSelectProps,
  type FieldMetadata,
} from "@conform-to/react";
import { useEffect, useRef, useState } from "react";

import CurrencySelect from "@/app/_components/ui/currency-select";
import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { cn } from "@/lib/tailwind";

interface FormPriceInputProps {
  label: string;
  priceField: FieldMetadata;
  currencyField: FieldMetadata<string>;
  disabled?: boolean;
  className?: string;
}

const FormPriceInput = ({
  label,
  priceField,
  currencyField,
  disabled,
  className,
}: FormPriceInputProps) => {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(
    currencyField.value ?? currencyField.defaultValue ?? "",
  );

  const currencyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currencyInputRef.current) {
      const event = new Event("input", { bubbles: true });
      currencyInputRef.current.dispatchEvent(event);
    }
  }, [selectedCurrencyCode]);

  const { name: currencyName, ...restCurrencyProps } =
    getSelectProps(currencyField);

  return (
    <div
      className={cn("group/form-component", "flex flex-col gap-y-1", className)}
    >
      <input
        ref={currencyInputRef}
        type="hidden"
        name={currencyName}
        value={selectedCurrencyCode}
      />

      <Label htmlFor={priceField.id} required={priceField.required}>
        {label}
      </Label>

      <div className="relative isolate">
        <Input
          {...getInputProps(priceField, {
            type: "text",
            ariaAttributes: true,
          })}
          inputMode="decimal"
          key={priceField.key}
          disabled={disabled}
          className="*:data-[slot=input]:pr-[72px]"
        />

        <CurrencySelect
          {...restCurrencyProps}
          name={currencyName}
          className={cn(
            "[--inset-x:--spacing(3)] [--inset-y:--spacing(4)]",
            "border-foreground absolute inset-y-(--inset-y) right-(--inset-x) m-0 w-fit gap-x-0 border-2 py-0 pr-1 pl-2 text-right",
            "before:hidden",
            "hover:bg-foreground/10 hover:bottom-(--inset-y)",
            "[&>span]:text-xs",
            "[&>svg]:size-4",
          )}
          defaultValue={selectedCurrencyCode}
          onChange={(value) => setSelectedCurrencyCode(value.code)}
          disabled={disabled}
          aria-invalid={currencyField.errors ? true : undefined}
          aria-describedby={
            currencyField.errors ? currencyField.errorId : undefined
          }
        />

        <FormError
          id={priceField.errorId}
          errors={
            priceField.errors || currencyField.errors
              ? [...(priceField.errors ?? []), ...(currencyField.errors ?? [])]
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default FormPriceInput;
