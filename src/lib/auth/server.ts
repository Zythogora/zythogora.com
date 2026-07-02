import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { getTranslations } from "next-intl/server";

import { hash, verify } from "@/lib/auth/crypto";
import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";
import { sendEmail } from "@/lib/email";
import ResetPasswordEmail from "@/lib/email/templates/reset-password";
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
      // A social sign-up creates the better-auth user before the user has
      // picked a username, so the `public.users` row may not exist yet. A
      // null username marks a session that still needs onboarding.
      const user = await prisma.users.findUnique({
        where: { id: betterAuthUser.id },
      });

      return {
        user: {
          id: betterAuthUser.id,
          name: betterAuthUser.name,
          username: user?.username ?? null,
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

    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
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

  socialProviders: config.auth.google
    ? {
        google: {
          clientId: config.auth.google.clientId,
          clientSecret: config.auth.google.clientSecret,
        },
      }
    : {},

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
    sendResetPassword: async ({ user, url }) => {
      const t = await getTranslations();

      await sendEmail(
        user.email,
        t("email.resetPassword.subject"),
        ResetPasswordEmail,
        {
          username: user.name,
          resetPasswordUrl: url,
        },
      );
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
