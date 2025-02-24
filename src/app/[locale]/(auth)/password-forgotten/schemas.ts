import { z } from "zod";

export const passwordForgottenSchema = z.object({
  email: z
    .string({ required_error: "form.errors.FIELD_REQUIRED" })
    .email({ message: "form.errors.EMAIL_INVALID" }),
});
