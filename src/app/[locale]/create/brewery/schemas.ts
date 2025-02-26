import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { z } from "zod";

import { zCountryCode } from "@/lib/i18n/countries/schemas";

export const createBrewerySchema = z
  .object({
    name: z.string({ required_error: "form.errors.FIELD_REQUIRED" }),
    country: zCountryCode,
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    creationDate: z
      .number()
      .min(1000, {
        message: "createBreweryPage.errors.MIN_CREATION_DATE_ERROR",
      })
      .max(new Date().getFullYear(), {
        message: "createBreweryPage.errors.MAX_CREATION_DATE_ERROR",
      })
      .optional(),
    description: z.string().optional(),
    websiteLink: z.string().optional(),
    socialLinks: z.array(
      z.object({
        name: z.string({ required_error: "form.errors.FIELD_REQUIRED" }),
        url: z
          .string({ required_error: "form.errors.FIELD_REQUIRED" })
          .regex(/^[^\s\.]+\.\S{2,}$/, {
            message: "form.errors.URL_INVALID",
          }),
      }),
    ),
    contactEmail: z
      .string()
      .email({ message: "form.errors.EMAIL_INVALID" })
      .optional(),
    contactPhoneNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.contactPhoneNumber &&
      !isValidPhoneNumber(data.contactPhoneNumber, {
        defaultCountry: data.country as CountryCode,
      })
    ) {
      ctx.addIssue({
        path: ["contactPhoneNumber"],
        code: z.ZodIssueCode.custom,
        message: "form.errors.PHONE_NUMBER_INVALID",
      });
    }
  });

export type CreateBreweryData = z.infer<typeof createBrewerySchema>;
