"server only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { hash, verify } from "@/lib/auth/crypto";
import { config } from "@/lib/config";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

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
    maxPasswordLength: 1024,
    password: {
      hash,
      verify,
    },
  },
});
