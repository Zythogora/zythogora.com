"use client";

import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getZodConstraint } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState, useTransition } from "react";

import { createBeerAction } from "@/app/[locale]/(forms)/create/beer/actions";
import { createBeerSchema } from "@/app/[locale]/(forms)/create/beer/schemas";
import FormBrewerySelect from "@/app/_components/form/brewery-select";
import FormColorSelect from "@/app/_components/form/color-select";
import FormInput from "@/app/_components/form/input";
import FormLegacyStyleSelect from "@/app/_components/form/legacy-style-select";
import QueryClientProvider from "@/app/_components/providers/query-client-provider";
import Button from "@/app/_components/ui/button";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import type { Color, LegacyStyle } from "@/domain/beers/types";

interface CreateBeerFormProps {
  styles: LegacyStyle[];
  colors: Color[];
}

const CreateBeerForm = ({ styles, colors }: CreateBeerFormProps) => {
  const t = useTranslations();

  const [lastResult, action] = useActionState(
    createBeerAction.bind(null, Routes.CREATE_BEER),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    lastResult,

    constraint: getZodConstraint(createBeerSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createBeerSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <QueryClientProvider>
      <FormProvider context={form.context}>
        <form
          {...getFormProps(form)}
          className={cn(
            "grid gap-x-6 gap-y-8",
            "w-full grid-cols-8 @3xl:w-192 @3xl:grid-cols-7",
          )}
        >
          <FormInput
            label={t("createBeerPage.fields.name.label")}
            field={fields.name}
            type="text"
            // className="col-span-6 @3xl:col-span-5"
            className="col-span-8 @3xl:col-span-7"
          />

          {/* <FormInput
            label={t("createBeerPage.fields.releasedIn.label")}
            field={fields.releasedIn}
            type="number"
            className={cn(
              "col-span-2",
              "*:data-[slot=label]:text-nowrap",
              "**:data-[slot=input]:px-2 **:data-[slot=input]:text-center @3xl:**:data-[slot=input]:px-5 @3xl:**:data-[slot=input]:text-left",
            )}
          /> */}

          <FormBrewerySelect
            label={t("createBeerPage.fields.brewery.label")}
            field={fields.breweryId}
            className="col-span-8 @3xl:col-span-7"
          />

          <FormLegacyStyleSelect
            label={t("createBeerPage.fields.style.label")}
            field={fields.styleId}
            styles={styles}
            className="col-span-8 @3xl:col-span-3"
          />

          <FormColorSelect
            label={t("createBeerPage.fields.color.label")}
            field={fields.colorId}
            colors={colors}
            className="col-span-4 @3xl:col-span-2"
          />

          <FormInput
            label={t("createBeerPage.fields.abv.label")}
            field={fields.abv}
            type="number"
            className={cn(
              "col-span-2 @3xl:col-span-1",
              "**:data-[slot=input]:px-2 **:data-[slot=input]:text-center",
            )}
          />

          <FormInput
            label={t("createBeerPage.fields.ibu.label")}
            field={fields.ibu}
            type="number"
            className={cn(
              "col-span-2 @3xl:col-span-1",
              "**:data-[slot=input]:px-2 **:data-[slot=input]:text-center",
            )}
          />

          {/* <FormTextarea
            label={t("createBeerPage.fields.description.label")}
            field={fields.description}
            rows={4}
            className="col-span-8 @3xl:col-span-7"
          /> */}

          <Button
            type="submit"
            disabled={isPending}
            className={cn("mt-2", "col-span-8 @3xl:col-span-7")}
          >
            {isPending
              ? t("createBeerPage.actions.submitting")
              : t("createBeerPage.actions.submit")}
          </Button>
        </form>
      </FormProvider>
    </QueryClientProvider>
  );
};

export default CreateBeerForm;
