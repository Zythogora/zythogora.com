import { z } from "zod";

import { zPassword } from "@/lib/validator";

export const resetPasswordSchema = z
  .object({
    password: zPassword({
      tooShort: "form.errors.PASSWORD_TOO_SHORT",
      tooLong: "form.errors.PASSWORD_TOO_LONG",
    }),
    confirmPassword: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "form.errors.FIELD_REQUIRED"
          : "form.errors.STRING_INVALID",
    }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "form.errors.PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });

export const resetPasswordSearchParamsSchema = z.union([
  z.object({
    token: z.string(),
    error: z.string().optional(),
  }),
  z.object({
    token: z.string().optional(),
    error: z.string(),
  }),
]);
