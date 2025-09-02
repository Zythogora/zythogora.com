"server only";

import { serverSideSchema } from "@/lib/config/types";

const loadConfig = () => {
  const parseResult = serverSideSchema.safeParse(process.env);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map(
      (issue) => ` - ${issue.path.join(".")}: ${issue.message}`,
    );

    throw new Error(
      `Missing required env variables:\n\t${errors.join(",\n\t")}`,
    );
  }

  const env = parseResult.data;

  return {
    nodeEnv: env.NODE_ENV,
    next: {
      staticGeneration: env.STATIC_GENERATION,
    },
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_URL,
    },
    email: {
      from: env.EMAIL_FROM,
      resendApiKey: env.RESEND_API_KEY,
    },
    auth: {
      cookiePrefix: env.COOKIE_PREFIX,
      hash: {
        pepper: env.HASH_PEPPER_SECRET,
      },
      availableProviders: env.AVAILABLE_PROVIDERS,
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    supabase: {
      storageUrl: env.SUPABASE_STORAGE_URL,
    },
    s3: {
      region: env.S3_REGION,
      accessKey: env.S3_ACCESS_KEY,
      secretKey: env.S3_SECRET_KEY,
    },
    gcp: {
      projectId: env.GCP_PROJECT_ID,
      serviceAccount: {
        email: env.GCP_SERVICE_ACCOUNT_EMAIL,
        privateKey: env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY,
      },
    },
  };
};

export const config = loadConfig();
