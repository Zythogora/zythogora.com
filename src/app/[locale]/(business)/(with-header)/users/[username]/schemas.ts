import { z } from "zod";

export const profileSearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
});
