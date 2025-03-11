import { z } from "zod";

export const servingFromValues = [
  "draft",
  "bottle",
  "can",
  "growler",
  "cask",
] as const;

export const labelDesignValues = [
  "hateIt",
  "meh",
  "average",
  "good",
  "loveIt",
] as const;

export const hazinessValues = [
  "completelyClear",
  "verySlightlyCast",
  "slightlyHazy",
  "hazy",
  "veryHazy",
] as const;

export const headRetentionValues = [
  "poor",
  "shortLived",
  "moderate",
  "good",
  "excellent",
] as const;

export const aromasIntensityValues = [
  "faint",
  "mild",
  "moderate",
  "pronounced",
  "intense",
] as const;

export const flavorsIntensityValues = [
  "faint",
  "mild",
  "moderate",
  "pronounced",
  "intense",
] as const;

export const bodyStrengthValues = [
  "thin",
  "light",
  "medium",
  "full",
  "heavy",
] as const;

export const carbonationIntensityValues = [
  "flat",
  "low",
  "moderate",
  "lively",
  "highlyCarbonated",
] as const;

export const bitternessValues = [
  "low",
  "moderate",
  "pronounced",
  "aggressive",
  "lingering",
] as const;

export const acidityValues = [
  "none",
  "soft",
  "bright",
  "tart",
  "puckering",
] as const;

export const durationValues = [
  "short",
  "moderate",
  "medium",
  "long",
  "endless",
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
