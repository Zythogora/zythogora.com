import { clientSideSchema } from "@/lib/config/types";

const loadPublicConfig = () => {
  // Need to explicitely pass each public variable for bundle substitution
  // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  const parseResult = clientSideSchema.safeParse({
    NEXT_PUBLIC_BASE_URL: process.env["NEXT_PUBLIC_BASE_URL"],
    NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"],
  });

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
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
    appName: env.NEXT_PUBLIC_APP_NAME,
  };
};

export const publicConfig = loadPublicConfig();
