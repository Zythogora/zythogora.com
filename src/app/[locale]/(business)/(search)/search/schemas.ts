import { z } from "zod";

import { SEARCH_KINDS } from "@/app/[locale]/(business)/(search)/search/types";

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  kind: z.enum(SEARCH_KINDS).optional().default("beers"),
  limit: z.coerce.number().optional().default(20),
  page: z.coerce.number().optional().default(1),
});
