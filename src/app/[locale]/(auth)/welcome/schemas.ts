import { z } from "zod";

import { zUsername } from "@/lib/validator";

export const welcomeSchema = z.object({
  username: zUsername,
});
