import { z } from "zod";

export const beerPageSearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
});
