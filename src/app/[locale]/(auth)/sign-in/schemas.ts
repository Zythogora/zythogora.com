import { z } from "zod";

import { zEmail, zPassword } from "@/lib/validator";

export const signInSchema = z.object({
  email: zEmail,
  password: zPassword({
    tooShort: "auth.signIn.errors.PASSWORD_INVALID",
    tooLong: "auth.signIn.errors.PASSWORD_INVALID",
  }),
  redirectUrl: z.string(),
});
