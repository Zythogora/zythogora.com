import { z } from "zod";

export enum NodeEnv {
  production = "production",
  development = "development",
  test = "test",
}

export const serverSideSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
});
