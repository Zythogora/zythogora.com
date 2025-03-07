import { z } from "zod";

export const profileParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
});
