"use client";

import { getSelectProps } from "@conform-to/react";
import { useTranslations } from "next-intl";
import { useRef, type ComponentProps } from "react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import StorageLocationSelector from "@/app/_components/ui/storage-location-selector";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormStorageLocationSelectorProps extends Omit<
  ComponentProps<typeof StorageLocationSelector>,
  "onChange" | "selectedLocationId"
> {
  field: FieldMetadata;
}

const FormStorageLocationSelector = ({
  field,
  locations,
  onCreateNew,
  className,
  ...restProps
}: FormStorageLocationSelectorProps) => {
  const t = useTranslations();

  const inputRef = useRef<HTMLInputElement>(null);

  const { key, name, ...restSelectProps } = getSelectProps(field);

  const handleChange = (location: StorageLocation | null) => {
    if (inputRef.current) {
      inputRef.current.value = location?.id ?? "";
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div
      className={cn(
        "group/form-component",
        "flex w-full flex-col gap-y-1",
        className,
      )}
    >
      <Label htmlFor={field.id} required={field.required}>
        {t("cellar.form.storageLocation.label")}
      </Label>

      <input ref={inputRef} type="hidden" name={name} defaultValue="" />

      <StorageLocationSelector
        key={key}
        locations={locations}
        selectedLocationId={field.value as string | undefined}
        onChange={handleChange}
        onCreateNew={onCreateNew}
        placeholder={t("cellar.form.storageLocation.placeholder")}
        {...restSelectProps}
        {...restProps}
      />

      <FormError id={field.errorId} errors={field.errors} />
    </div>
  );
};

export default FormStorageLocationSelector;
