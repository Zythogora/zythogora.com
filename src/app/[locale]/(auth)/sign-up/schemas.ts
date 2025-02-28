import { z } from "zod";

import { zEmail } from "@/lib/validator";
import { zPassword } from "@/lib/validator";

export const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "form.errors.FIELD_REQUIRED" })
      .min(3, { message: "auth.signUp.errors.USERNAME_TOO_SHORT" })
      .max(25, { message: "auth.signUp.errors.USERNAME_TOO_LONG" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "auth.signUp.errors.USERNAME_INVALID_CHARACTERS",
      }),
    email: zEmail,
    password: zPassword({
      tooShort: "form.errors.PASSWORD_TOO_SHORT",
      tooLong: "form.errors.PASSWORD_TOO_LONG",
    }),
    confirmPassword: z.string({
      required_error: "form.errors.FIELD_REQUIRED",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "form.errors.PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });
