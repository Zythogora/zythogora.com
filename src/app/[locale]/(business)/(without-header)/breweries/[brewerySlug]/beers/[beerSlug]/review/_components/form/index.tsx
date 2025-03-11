"use client";

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { getZodConstraint } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { reviewAction } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/actions";
import {
  acidityValues,
  aromasIntensityValues,
  bitternessValues,
  bodyStrengthValues,
  carbonationIntensityValues,
  durationValues,
  flavorsIntensityValues,
  hazinessValues,
  headRetentionValues,
  labelDesignValues,
  reviewSchema,
} from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import FormFiveStepSelector from "@/app/_components/form/five-step-selector";
import FormGroup from "@/app/_components/form/group";
import FormServingFromSelector from "@/app/_components/form/serving-form-selector";
import FormSlider from "@/app/_components/form/slider";
import FormTextarea from "@/app/_components/form/textarea";
import Button from "@/app/_components/ui/button";
import { usePathname, useRouter } from "@/lib/i18n";

interface ReviewFormProps {
  beerId: string;
}

const ReviewForm = ({ beerId }: ReviewFormProps) => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();

  const [lastResult, action, isPending] = useActionState(
    reviewAction.bind(null, pathname),
    undefined,
  );

  const [form, fields] = useForm({
    defaultValue: { beerId },

    lastResult,

    constraint: getZodConstraint(reviewSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: reviewSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormProvider context={form.context}>
      <form
        {...getFormProps(form)}
        action={action}
        className="flex w-full flex-col gap-y-16"
      >
        <input
          {...getInputProps(fields.beerId, {
            type: "hidden",
            ariaAttributes: false,
          })}
          key={fields.beerId.key}
        />

        <FormGroup
          formId={form.id}
          label={t("createReviewPage.fieldGroups.overall.label")}
        >
          <FormSlider
            label={t(
              "createReviewPage.fieldGroups.overall.fields.appreciation.label",
            )}
            field={fields.globalScore}
            min={0}
            max={10}
            defaultValue={[5]}
            step={0.5}
          />

          <FormServingFromSelector field={fields.servingFrom} />

          <FormTextarea
            label={t(
              "createReviewPage.fieldGroups.overall.fields.comment.label",
            )}
            field={fields.comment}
            rows={6}
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("createReviewPage.fieldGroups.appearance.label")}
          className="grid grid-cols-1 gap-x-12 gap-y-8 @3xl:grid-cols-2"
        >
          <FormFiveStepSelector
            field={fields.labelDesign}
            group="appearance"
            possibleValues={labelDesignValues}
            className="@3xl:col-span-2"
          />

          <FormFiveStepSelector
            field={fields.haziness}
            group="appearance"
            possibleValues={hazinessValues}
          />

          <FormFiveStepSelector
            field={fields.headRetention}
            group="appearance"
            possibleValues={headRetentionValues}
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("createReviewPage.fieldGroups.nose.label")}
        >
          <FormFiveStepSelector
            field={fields.aromasIntensity}
            group="nose"
            possibleValues={aromasIntensityValues}
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("createReviewPage.fieldGroups.taste.label")}
          className="grid grid-cols-1 gap-x-12 gap-y-8 @3xl:grid-cols-2"
        >
          <FormFiveStepSelector
            field={fields.flavorsIntensity}
            group="taste"
            possibleValues={flavorsIntensityValues}
            className="@3xl:col-span-2"
          />

          <FormFiveStepSelector
            field={fields.bodyStrength}
            group="taste"
            possibleValues={bodyStrengthValues}
          />

          <FormFiveStepSelector
            field={fields.carbonationIntensity}
            group="taste"
            possibleValues={carbonationIntensityValues}
          />

          <FormFiveStepSelector
            field={fields.bitterness}
            group="taste"
            possibleValues={bitternessValues}
          />

          <FormFiveStepSelector
            field={fields.acidity}
            group="taste"
            possibleValues={acidityValues}
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("createReviewPage.fieldGroups.finish.label")}
        >
          <FormFiveStepSelector
            field={fields.duration}
            group="finish"
            possibleValues={durationValues}
          />
        </FormGroup>

        <div className="grid w-full grid-cols-3 gap-4">
          <Button
            type="reset"
            onClick={handleCancel}
            variant="outline"
            disabled={isPending}
            className="col-span-3 row-start-2 @md:col-span-1 @md:row-start-auto"
          >
            {t("createReviewPage.actions.cancel")}
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="col-span-3 @md:col-span-2"
          >
            {isPending
              ? t("createReviewPage.actions.saving")
              : t("createReviewPage.actions.complete")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ReviewForm;
