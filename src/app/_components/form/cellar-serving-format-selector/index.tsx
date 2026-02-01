"use client";

import { getInputProps } from "@conform-to/react";
import { useTranslations } from "next-intl";
import { type ComponentProps } from "react";

import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import CellarServingFormatSelector, {
  type CellarServingFormat,
} from "@/app/_components/ui/cellar-serving-format-selector";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormCellarServingFormatSelectorProps
  extends ComponentProps<typeof CellarServingFormatSelector> {
  field: FieldMetadata;
}

const FormCellarServingFormatSelector = ({
  field,
  ...restProps
}: FormCellarServingFormatSelectorProps) => {
  const t = useTranslations();

  const { key, ...restInputProps } = getInputProps(field, {
    type: "text",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, value, type, ...ariaInputProps } = restInputProps;

  return (
    <div
      className={cn("group/form-component", "flex w-full flex-col gap-y-1")}
    >
      <Label htmlFor={field.id} required={field.required}>
        {field.value
          ? t(
              `cellar.form.servingFormat.values.${field.value as CellarServingFormat}`,
            )
          : t("cellar.form.servingFormat.label")}
      </Label>

      <div className="w-full">
        <CellarServingFormatSelector
          key={key}
          {...ariaInputProps}
          {...restProps}
        />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormCellarServingFormatSelector;
