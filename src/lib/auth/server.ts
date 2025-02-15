"server only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { getTranslations } from "next-intl/server";

import { hash, verify } from "@/lib/auth/crypto";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { sendEmail } from "@/lib/email";
import WelcomeEmail from "@/lib/email/templates/welcome";
import prisma from "@/lib/prisma";

import type { TFunction } from "@/lib/i18n/types";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: publicConfig.baseUrl,
  appName: "Zythogora",

  plugins: [nextCookies()], // ⚠️ `nextCookies` must be the last plugin of the array

  user: {
    modelName: "BetterAuthUsers",
  },

  account: {
    modelName: "Accounts",
  },

  verification: {
    modelName: "Verifications",
  },

  session: {
    modelName: "Sessions",

    cookieCache: {
      enabled: true, // Enable cookie caching for 5 minutes
      maxAge: 5 * 60,
    },
  },

  advanced: {
    cookiePrefix: config.auth.cookiePrefix,
  },

  // Email/Password provider
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    maxPasswordLength: 1024,
    password: {
      hash,
      verify,
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const t = (await getTranslations()) as TFunction;

      await sendEmail(user.email, t("email.welcome.subject"), WelcomeEmail, {
        username: user.name,
        activationUrl: url,
      });
    },
  },
});
