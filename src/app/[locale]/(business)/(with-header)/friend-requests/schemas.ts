import { z } from "zod";

export const friendRequestSearchParamsSchema = z.object({
  id: z.string(),
});
