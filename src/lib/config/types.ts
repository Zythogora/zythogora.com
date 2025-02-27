import { z } from "zod";

export enum NodeEnv {
  production = "production",
  development = "development",
  test = "test",
}

export enum StaticGenerationMode {
  ALL = "ALL",
  SLUG_ONLY = "SLUG_ONLY",
  NONE = "NONE",
}

const parseArray = z.string().transform((str, ctx): string[] => {
  try {
    const parsed = JSON.parse(str);

    if (!Array.isArray(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not an array",
      });
      return z.NEVER;
    }

    return parsed;
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return z.NEVER;
  }
});

export const serverSideSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  STATIC_GENERATION: z.nativeEnum(StaticGenerationMode),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  COOKIE_PREFIX: z.string(),
  HASH_PEPPER_SECRET: z.string(),
  AVAILABLE_PROVIDERS: parseArray,
});

export const clientSideSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_APP_NAME: z.string(),
});
