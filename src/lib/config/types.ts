import { z } from "zod";

export enum NodeEnv {
  production = "production",
  development = "development",
  test = "test",
}

export const serverSideSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  COOKIE_PREFIX: z.string(),
  HASH_PEPPER_SECRET: z.string(),
});
