import { z } from "zod";

import { zRequiredString } from "@/lib/validator";

export const createBeerSchema = z.object({
  name: zRequiredString,
  breweryId: zRequiredString,
  styleId: zRequiredString,
  colorId: zRequiredString,
  abv: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "form.errors.FIELD_REQUIRED"
          : "form.errors.NUMBER_INVALID",
    })
    .min(0)
    .max(100),
  ibu: z.number().min(0).optional(),
  releaseYear: z
    .number()
    .min(1000, {
      message: "createBeerPage.errors.MIN_RELEASE_YEAR_ERROR",
    })
    .max(new Date().getFullYear(), {
      message: "createBeerPage.errors.MAX_RELEASE_YEAR_ERROR",
    })
    .optional(),
  description: z.string().optional(),
  organic: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().default(false),
  ),
  barrelAged: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().default(false),
  ),
});

export type CreateBeerData = z.infer<typeof createBeerSchema>;
