import { z } from "zod";

export const brewerySearchParamsSchema = z.object({
  tab: z.enum(["beers", "reviews"]).optional().default("beers"),
  page: z.coerce.number().optional().default(1),
});
