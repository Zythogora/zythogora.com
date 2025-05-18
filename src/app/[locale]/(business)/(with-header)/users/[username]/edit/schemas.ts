import { z } from "zod";

export const editProfileSchema = z.object({
  username: z.string().optional(),
});
