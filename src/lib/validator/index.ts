import { z } from "zod";

import { countryCodes } from "@/lib/i18n/countries";

export const zRequiredString = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "form.errors.FIELD_REQUIRED"
        : "form.errors.STRING_INVALID",
  })
  .regex(/^(?!\s*$).+/, {
    message: "form.errors.FIELD_REQUIRED",
  })
  .trim();

export const zEmail = z
  .email({
    error: (issue) =>
      issue.input === undefined
        ? "form.errors.FIELD_REQUIRED"
        : "form.errors.EMAIL_INVALID",
  })
  .trim();

export const zPassword = ({
  tooShort,
  tooLong,
}: {
  tooShort: string;
  tooLong: string;
}) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "form.errors.FIELD_REQUIRED"
          : "form.errors.STRING_INVALID",
    })
    .trim()
    .min(8, { message: tooShort })
    .max(1024, { message: tooLong });

export const zUrl = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "form.errors.FIELD_REQUIRED"
        : "form.errors.STRING_INVALID",
  })
  .regex(/^[^\s\.]+\.\S{2,}$/, {
    message: "form.errors.URL_INVALID",
  })
  .trim();

export const zCountryCode = z
  .string({ message: "form.errors.FIELD_REQUIRED" })
  .refine((code) => countryCodes.includes(code), {
    message: "form.errors.COUNTRY_CODE_INVALID",
  });
