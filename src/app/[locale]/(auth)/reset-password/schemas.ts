import { z } from "zod";

import { zPassword } from "@/lib/validator";

export const resetPasswordSchema = z
  .object({
    password: zPassword({
      tooShort: "form.errors.PASSWORD_TOO_SHORT",
      tooLong: "form.errors.PASSWORD_TOO_LONG",
    }),
    confirmPassword: z.string({
      required_error: "form.errors.FIELD_REQUIRED",
    }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "form.errors.PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });
