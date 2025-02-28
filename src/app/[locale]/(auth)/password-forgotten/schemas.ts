import { z } from "zod";

import { zEmail } from "@/lib/validator";

export const passwordForgottenSchema = z.object({
  email: zEmail,
});
