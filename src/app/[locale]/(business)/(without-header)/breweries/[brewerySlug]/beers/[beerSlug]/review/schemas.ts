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
} from "@prisma/client";
import { z } from "zod";

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

export const reviewSchema = z.object({
  beerId: z.string(),

  globalScore: z.number().min(0).max(10).multipleOf(0.5),
  servingFrom: z.enum(servingFromValues, {
    required_error: "form.errors.FIELD_REQUIRED",
  }),
  comment: z.string().optional(),

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
});

export type CreateReviewData = z.infer<typeof reviewSchema>;
