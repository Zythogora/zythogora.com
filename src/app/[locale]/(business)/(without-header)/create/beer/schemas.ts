import { z } from "zod";

import { zRequiredString } from "@/lib/validator";

export const createBeerSchema = z.object({
  name: zRequiredString,
  breweryId: zRequiredString,
  styleId: zRequiredString,
  colorId: zRequiredString,
  abv: z
    .number({ required_error: "form.errors.FIELD_REQUIRED" })
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
});

export type CreateBeerData = z.infer<typeof createBeerSchema>;
