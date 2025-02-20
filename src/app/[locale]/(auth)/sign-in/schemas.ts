import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "form.errors.FIELD_REQUIRED" })
    .email({ message: "form.errors.EMAIL_INVALID" }),
  password: z
    .string({ required_error: "form.errors.FIELD_REQUIRED" })
    .min(8, { message: "auth.signIn.errors.PASSWORD_INVALID" })
    .max(1024, { message: "auth.signIn.errors.PASSWORD_INVALID" }),
  redirectUrl: z.string(),
});
