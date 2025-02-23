"server only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { getTranslations } from "next-intl/server";

import { hash, verify } from "@/lib/auth/crypto";
import { UserRecordNotFoundError } from "@/lib/auth/errors";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { sendEmail } from "@/lib/email";
import WelcomeEmail from "@/lib/email/templates/welcome";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: publicConfig.baseUrl,
  appName: publicConfig.appName,

  plugins: [
    customSession(async ({ user: betterAuthUser, session }) => {
      const user = await prisma.users.findUnique({
        where: { id: betterAuthUser.id },
      });

      if (!user) {
        console.error(`User with id ${betterAuthUser.id} not found`);
        throw new UserRecordNotFoundError();
      }

      return {
        user: {
          id: betterAuthUser.id,
          name: betterAuthUser.name,
          username: user.username,
          email: betterAuthUser.email,
          image: betterAuthUser.image,
        },
        session,
      };
    }),
    // ⚠️ `nextCookies` must be the last plugin of the array
    nextCookies(),
  ],

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
    minPasswordLength: 8,
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
      const t = await getTranslations();

      const urlWithCallback = new URL(url);
      urlWithCallback.searchParams.set(
        "callbackURL",
        `${Routes.HOME}?verified=true`,
      );

      await sendEmail(user.email, t("email.welcome.subject"), WelcomeEmail, {
        username: user.name,
        activationUrl: urlWithCallback.toString(),
      });
    },
  },
});
