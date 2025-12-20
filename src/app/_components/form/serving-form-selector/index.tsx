"use client";

import { getInputProps } from "@conform-to/react";
import { useTranslations } from "next-intl";
import { type ComponentProps } from "react";

import type { servingFromValues } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import ServingFromSelector from "@/app/_components/ui/serving-from-selector";
import { cn } from "@/lib/tailwind";

import type { FieldMetadata } from "@conform-to/react";

interface FormServingFromSelectorProps
  extends ComponentProps<typeof ServingFromSelector> {
  field: FieldMetadata;
}

const FormServingFromSelector = ({
  field,
  ...restProps
}: FormServingFromSelectorProps) => {
  const t = useTranslations();

  const { key, ...restInputProps } = getInputProps(field, {
    type: "text",
    ariaAttributes: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, value, type, ...ariaInputProps } = restInputProps;

  return (
    <div className={cn("group/form-component", "flex w-full flex-col gap-y-1")}>
      <Label htmlFor={field.id} required={field.required}>
        {field.value
          ? t(
              `reviewPage.overall.fields.servingFrom.possibleValues.${field.value as (typeof servingFromValues)[number]}`,
            )
          : t("reviewPage.overall.fields.servingFrom.label")}
      </Label>

      <div className="w-full">
        <ServingFromSelector key={key} {...ariaInputProps} {...restProps} />

        <FormError id={field.errorId} errors={field.errors} />
      </div>
    </div>
  );
};

export default FormServingFromSelector;
