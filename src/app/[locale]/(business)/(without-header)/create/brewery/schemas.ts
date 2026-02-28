import { parsePhoneNumberWithError, type CountryCode } from "libphonenumber-js";
import { z } from "zod";

import { zCountryCode, zEmail, zRequiredString, zUrl } from "@/lib/validator";

const createBreweryBaseSchema = z
  .object({
    name: zRequiredString,
    country: zCountryCode,
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    creationYear: z
      .number()
      .min(1000, {
        message: "createBreweryPage.errors.MIN_CREATION_YEAR_ERROR",
      })
      .max(new Date().getFullYear(), {
        message: "createBreweryPage.errors.MAX_CREATION_YEAR_ERROR",
      })
      .optional(),
    description: z.string().optional(),
    organic: z
      .preprocess((val) => val === "on" || val === true, z.boolean())
      .default(false),
    websiteLink: zUrl.optional(),
    socialLinks: z.array(
      z.object({
        name: z.string({
          error: (issue) =>
            issue.input === undefined
              ? "form.errors.FIELD_REQUIRED"
              : "form.errors.STRING_INVALID",
        }),
        url: zUrl,
      }),
    ),
    contactEmail: zEmail.optional(),
    contactPhoneNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contactPhoneNumber) {
      try {
        parsePhoneNumberWithError(
          data.contactPhoneNumber,
          data.country as CountryCode,
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        ctx.addIssue({
          path: ["contactPhoneNumber"],
          code: z.ZodIssueCode.custom,
          message: "form.errors.PHONE_NUMBER_INVALID",
        });
      }
    }
    return z.NEVER;
  });

// Schema for constraints (without transform) - getZodConstraint doesn't support transforms
export const createBreweryConstraintSchema = createBreweryBaseSchema;

// Full schema with transform for validation
export const createBrewerySchema = createBreweryBaseSchema.transform((data) => {
  if (data.contactPhoneNumber) {
    return {
      ...data,
      contactPhoneNumber: parsePhoneNumberWithError(
        data.contactPhoneNumber,
        data.country as CountryCode,
      ).formatInternational(),
    };
  }

  return data;
});

export type CreateBreweryData = z.infer<typeof createBrewerySchema>;
