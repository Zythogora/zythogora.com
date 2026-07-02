import { z } from "zod";

import { zUsername } from "@/lib/validator";

export const updateUsernameSchema = z.object({
  username: zUsername,
});
