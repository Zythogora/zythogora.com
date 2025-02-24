import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "form.errors.FIELD_REQUIRED" })
      .min(8, { message: "form.errors.PASSWORD_TOO_SHORT" })
      .max(1024, { message: "form.errors.PASSWORD_TOO_LONG" }),
    confirmPassword: z.string({
      required_error: "form.errors.FIELD_REQUIRED",
    }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "form.errors.PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });
