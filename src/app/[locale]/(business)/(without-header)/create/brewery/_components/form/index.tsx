"use client";

import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getZodConstraint } from "@conform-to/zod";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useState, useTransition } from "react";

import SocialLink, {
  emptySocialLinkValue,
} from "@/app/[locale]/(business)/(without-header)/create/brewery/_components/social-link";
import { createBreweryAction } from "@/app/[locale]/(business)/(without-header)/create/brewery/actions";
import {
  createBrewerySchema,
  type CreateBreweryData,
} from "@/app/[locale]/(business)/(without-header)/create/brewery/schemas";
import FormCountrySelect from "@/app/_components/form/country-select";
import FormInput from "@/app/_components/form/input";
import FormTextarea from "@/app/_components/form/textarea";
import Button from "@/app/_components/ui/button";
import Label from "@/app/_components/ui/label";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

const CreateBreweryForm = () => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? null;

  const [socialLinks, setSocialLinks] = useState<
    CreateBreweryData["socialLinks"]
  >([emptySocialLinkValue]);

  const [lastResult, action] = useActionState(
    createBreweryAction.bind(null, Routes.CREATE_BREWERY, redirectUrl),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    defaultValue: { socialLinks },

    lastResult,

    constraint: getZodConstraint(createBrewerySchema),

    onValidate({ formData }) {
      // Remove empty social links
      Array.from(formData.keys())
        .filter((key) => key.match(/socialLinks\[(\d+)\]\.name/))
        .forEach((key, index) => {
          if (
            formData.get(`socialLinks[${index}].name`) === "" &&
            formData.get(`socialLinks[${index}].url`) === ""
          ) {
            formData.delete(`socialLinks[${index}].name`);
            formData.delete(`socialLinks[${index}].url`);
          }
        });

      return parseWithZod(formData, { schema: createBrewerySchema });
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

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, emptySocialLinkValue]);
  };

  const handleChangeSocialLink = (
    index: number,
    field: keyof CreateBreweryData["socialLinks"][number],
    value: string,
  ) => {
    setSocialLinks(
      socialLinks.map((socialLink, i) =>
        i === index ? { ...socialLink, [field]: value } : socialLink,
      ),
    );
  };

  const handleRemoveSocialLink = (index: number) => {
    if (socialLinks.length === 1) {
      setSocialLinks([emptySocialLinkValue]);
    } else {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  return (
    <FormProvider context={form.context}>
      <form
        {...getFormProps(form)}
        className={cn(
          "grid gap-x-6 gap-y-8",
          "w-full grid-cols-2 @3xl:w-192 @3xl:grid-cols-7",
        )}
      >
        <FormInput
          label={t("createBreweryPage.fields.name.label")}
          field={fields.name}
          type="text"
          className="col-span-2 @3xl:col-span-5"
        />

        <FormInput
          label={t("createBreweryPage.fields.creationYear.label")}
          field={fields.creationYear}
          type="number"
          className="col-span-2 col-start-1 row-start-6 @3xl:col-start-6 @3xl:row-start-1"
        />

        <FormCountrySelect
          label={t("createBreweryPage.fields.country.label")}
          field={fields.country}
          searchPlaceholder={t("form.fields.countrySelect.searchPlaceholder")}
          className="col-span-2 @3xl:col-span-3"
        />

        <FormInput
          label={t("createBreweryPage.fields.state.label")}
          field={fields.state}
          type="text"
          className="@3xl:col-span-2"
        />

        <FormInput
          label={t("createBreweryPage.fields.city.label")}
          field={fields.city}
          type="text"
          className="@3xl:col-span-2"
        />

        <FormInput
          label={t("createBreweryPage.fields.address.label")}
          field={fields.address}
          type="text"
          className="col-span-2 @3xl:col-span-7"
        />

        <FormTextarea
          label={t("createBreweryPage.fields.description.label")}
          field={fields.description}
          rows={4}
          className="col-span-2 @3xl:col-span-7"
        />

        <FormInput
          label={t("createBreweryPage.fields.websiteLink.label")}
          field={fields.websiteLink}
          type="text"
          className="col-span-2 @3xl:col-span-7"
        />

        <div className="col-span-2 flex flex-col gap-y-1 @3xl:col-span-7">
          <Label htmlFor={fields.socialLinks.id}>
            {t("createBreweryPage.fields.socialLinks.label")}
          </Label>

          <div className="flex flex-col items-start gap-y-4">
            <div className="flex w-full flex-col gap-y-6">
              {socialLinks.map((socialLink, index) => (
                <SocialLink
                  key={index}
                  index={index}
                  socialLink={socialLink}
                  onChange={handleChangeSocialLink}
                  onRemove={handleRemoveSocialLink}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSocialLink}
              aria-label={t("createBreweryPage.fields.socialLinks.actions.add")}
              className={cn(
                "ml-2 flex flex-row items-center gap-x-2 rounded px-1",
                "focus-visible:outline-offset-4",
              )}
            >
              <PlusIcon className="size-4" />

              <span>
                {t("createBreweryPage.fields.socialLinks.actions.add")}
              </span>
            </button>
          </div>
        </div>

        <FormInput
          label={t("createBreweryPage.fields.contactEmail.label")}
          field={fields.contactEmail}
          type="email"
          className="col-span-2 @3xl:col-span-4"
        />

        <FormInput
          label={t("createBreweryPage.fields.contactPhoneNumber.label")}
          field={fields.contactPhoneNumber}
          type="tel"
          className="col-span-2 @3xl:col-span-3"
        />

        <Button
          type="submit"
          disabled={isPending}
          className={cn("mt-2", "col-span-2 @3xl:col-span-7")}
        >
          {isPending
            ? t("createBreweryPage.actions.submitting")
            : t("createBreweryPage.actions.submit")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreateBreweryForm;
