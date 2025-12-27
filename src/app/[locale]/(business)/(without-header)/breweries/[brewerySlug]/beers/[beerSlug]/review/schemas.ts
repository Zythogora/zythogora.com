import { z } from "zod";

import {
  Acidity,
  AromasIntensity,
  Bitterness,
  BodyStrength,
  CarbonationIntensity,
  Duration,
  FlavorsIntensity,
  Haziness,
  HeadRetention,
  LabelDesign,
  ServingFrom,
} from "@db/enums";

export const servingFromValues = [
  ServingFrom.DRAFT,
  ServingFrom.BOTTLE,
  ServingFrom.CAN,
  ServingFrom.GROWLER,
  ServingFrom.CASK,
] as const;

export const labelDesignValues = [
  LabelDesign.HATE_IT,
  LabelDesign.MEH,
  LabelDesign.AVERAGE,
  LabelDesign.GOOD,
  LabelDesign.LOVE_IT,
] as const;

export const hazinessValues = [
  Haziness.COMPLETELY_CLEAR,
  Haziness.VERY_SLIGHTLY_CAST,
  Haziness.SLIGHTLY_HAZY,
  Haziness.HAZY,
  Haziness.VERY_HAZY,
] as const;

export const headRetentionValues = [
  HeadRetention.POOR,
  HeadRetention.SHORT_LIVED,
  HeadRetention.MODERATE,
  HeadRetention.GOOD,
  HeadRetention.EXCELLENT,
] as const;

export const aromasIntensityValues = [
  AromasIntensity.FAINT,
  AromasIntensity.MILD,
  AromasIntensity.MODERATE,
  AromasIntensity.PRONOUNCED,
  AromasIntensity.INTENSE,
] as const;

export const flavorsIntensityValues = [
  FlavorsIntensity.FAINT,
  FlavorsIntensity.MILD,
  FlavorsIntensity.MODERATE,
  FlavorsIntensity.PRONOUNCED,
  FlavorsIntensity.INTENSE,
] as const;

export const bodyStrengthValues = [
  BodyStrength.THIN,
  BodyStrength.LIGHT,
  BodyStrength.MEDIUM,
  BodyStrength.FULL,
  BodyStrength.HEAVY,
] as const;

export const carbonationIntensityValues = [
  CarbonationIntensity.FLAT,
  CarbonationIntensity.LOW,
  CarbonationIntensity.MODERATE,
  CarbonationIntensity.LIVELY,
  CarbonationIntensity.HIGHLY_CARBONATED,
] as const;

export const bitternessValues = [
  Bitterness.LOW,
  Bitterness.MODERATE,
  Bitterness.PRONOUNCED,
  Bitterness.AGGRESSIVE,
  Bitterness.LINGERING,
] as const;

export const acidityValues = [
  Acidity.NONE,
  Acidity.SOFT,
  Acidity.BRIGHT,
  Acidity.TART,
  Acidity.PUCKERING,
] as const;

export const durationValues = [
  Duration.SHORT,
  Duration.MODERATE,
  Duration.MEDIUM,
  Duration.LONG,
  Duration.ENDLESS,
] as const;

export const MAX_REVIEW_PICTURE_SIZE = 20 * 1024 * 1024;
export const ALLOWED_REVIEW_PICTURE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export const reviewSchema = z.object({
  beerId: z.string(),

  globalScore: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "form.errors.FIELD_REQUIRED"
          : "form.errors.NUMBER_INVALID",
    })
    .min(0)
    .max(10)
    .multipleOf(0.5),
  servingFrom: z.enum(servingFromValues, {
    error: (issue) =>
      issue.input === undefined
        ? "form.errors.FIELD_REQUIRED"
        : "form.errors.ENUM_INVALID",
  }),
  bestBeforeDate: z.coerce.date().optional(),
  comment: z.string().optional(),
  picture: z
    .custom<File>()
    .transform((file) => (file.size > 0 ? file : undefined))
    .superRefine((file, ctx) => {
      if (file && !ALLOWED_REVIEW_PICTURE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "form.errors.INVALID_FILE_TYPE",
          fatal: true,
        });

        return z.NEVER;
      }

      if (file && file.size > MAX_REVIEW_PICTURE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "form.errors.FILE_SIZE_TOO_LARGE",
          fatal: true,
        });

        return z.NEVER;
      }
    })
    .optional(),

  labelDesign: z.enum(labelDesignValues).optional(),
  haziness: z.enum(hazinessValues).optional(),
  headRetention: z.enum(headRetentionValues).optional(),

  aromasIntensity: z.enum(aromasIntensityValues).optional(),

  flavorsIntensity: z.enum(flavorsIntensityValues).optional(),
  bodyStrength: z.enum(bodyStrengthValues).optional(),
  carbonationIntensity: z.enum(carbonationIntensityValues).optional(),
  bitterness: z.enum(bitternessValues).optional(),
  acidity: z.enum(acidityValues).optional(),

  duration: z.enum(durationValues).optional(),

  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "form.errors.FIELD_REQUIRED"
          : "form.errors.NUMBER_INVALID",
    })
    .min(0)
    .optional(),
});

export type CreateReviewData = z.infer<typeof reviewSchema>;
