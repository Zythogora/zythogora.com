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
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import {
  acidityValues,
  ALLOWED_REVIEW_PICTURE_TYPES,
  aromasIntensityValues,
  bitternessValues,
  bodyStrengthValues,
  carbonationIntensityValues,
  durationValues,
  flavorsIntensityValues,
  hazinessValues,
  headRetentionValues,
  labelDesignValues,
  MAX_REVIEW_PICTURE_SIZE,
  reviewSchema,
} from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import FormFileUpload from "@/app/_components/form/file-upload";
import FormFiveStepSelector from "@/app/_components/form/five-step-selector";
import FormGroup from "@/app/_components/form/group";
import FormServingFromSelector from "@/app/_components/form/serving-form-selector";
import FormSlider from "@/app/_components/form/slider";
import FormTextarea from "@/app/_components/form/textarea";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import { usePathname, useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { ReviewActionData } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import type { SubmissionResult } from "@conform-to/react";

interface ReviewFormProps {
  beerId: string;
  reviewAction: (
    pathname: string,
    previousState: unknown,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]> | undefined>;
  defaultValue?: Omit<ReviewActionData, "picture"> & { pictureUrl?: string };
  existingReviewParams?: {
    username: string;
    reviewSlug: string;
  };
}

const ReviewForm = ({
  beerId,
  reviewAction,
  defaultValue,
  existingReviewParams,
}: ReviewFormProps) => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();

  const [lastResult, action] = useActionState(
    reviewAction.bind(null, pathname),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    defaultValue: { beerId, ...defaultValue },

    lastResult,

    constraint: getZodConstraint(reviewSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: reviewSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();

      console.log(formData.get("picture"));

      startTransition(() => {
        action(formData);
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleCancel = () => {
    if (existingReviewParams) {
      router.push(
        generatePath(Routes.REVIEW, {
          username: existingReviewParams.username,
          reviewSlug: existingReviewParams.reviewSlug,
        }),
      );
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (lastResult && lastResult.status === "error" && lastResult.error) {
      // @ts-expect-error Typescript doesn't know that the error is a message key
      toast.error(t(Object.values(lastResult.error)[0][0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

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

        <FormGroup formId={form.id} label={t("reviewPage.overall.title")}>
          <FormSlider
            label={t("reviewPage.overall.fields.appreciation.label")}
            field={fields.globalScore}
            min={0}
            max={10}
            defaultValue={[defaultValue?.globalScore ?? 5]}
            step={0.5}
          />

          <FormServingFromSelector field={fields.servingFrom} />

          <FormTextarea
            label={t("reviewPage.overall.fields.comment.label")}
            field={fields.comment}
            rows={6}
          />

          <FormFileUpload
            label={t("reviewPage.overall.fields.picture.label")}
            field={fields.picture}
            maxSize={MAX_REVIEW_PICTURE_SIZE}
            acceptedTypes={ALLOWED_REVIEW_PICTURE_TYPES}
            existingPictureUrl={defaultValue?.pictureUrl}
            initialFiles={
              defaultValue?.pictureUrl
                ? [
                    {
                      id: defaultValue.pictureUrl,
                      name: defaultValue.pictureUrl,
                      size: 1234,
                      type: "image/jpeg",
                      url: defaultValue.pictureUrl,
                    },
                  ]
                : undefined
            }
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("reviewPage.appearance.title")}
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

        <FormGroup formId={form.id} label={t("reviewPage.nose.title")}>
          <FormFiveStepSelector
            field={fields.aromasIntensity}
            group="nose"
            possibleValues={aromasIntensityValues}
          />
        </FormGroup>

        <FormGroup
          formId={form.id}
          label={t("reviewPage.taste.title")}
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

        <FormGroup formId={form.id} label={t("reviewPage.finish.title")}>
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

        {lastResult?.error?.[""] ? (
          <FormError
            id={form.errorId}
            errors={lastResult?.error?.[""] ?? []}
            className="my-0 h-fit"
          />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default ReviewForm;
