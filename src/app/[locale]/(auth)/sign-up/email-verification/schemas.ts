import { z } from "zod";

import { zEmail } from "@/lib/validator";

export const emailVerificationSearchParamsSchema = z.object({
  email: zEmail,
});
