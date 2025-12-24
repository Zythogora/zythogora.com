import { z } from "zod";

import { zEmail } from "@/lib/validator";

export const passwordForgottenSchema = z.object({
  email: zEmail,
});

export const passwordForgottenSearchParamsSchema = z.object({
  email: zEmail.optional().default(""),
});
