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
      const [user, [stats]] = await Promise.all([
        prisma.users.findUnique({
          where: { id: betterAuthUser.id },
          include: { _count: { select: { reviews: true } } },
        }),

        prisma.$queryRaw`
          SELECT COUNT(DISTINCT beer_id)
          FROM public.reviews
          WHERE user_id = ${betterAuthUser.id};
        ` as Promise<{ count: number }[]>,
      ]);

      if (!user || !stats) {
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
          reviewCount: user._count.reviews,
          uniqueBeerCount: Number(stats.count),
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

  socialProviders: {
    google: {
      clientId: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
    },
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
