import { APIError } from "better-auth/api";
import { getTranslations } from "next-intl/server";

import { Prisma } from "@db/client";

import {
  EmailAlreadyExistsError,
  InvalidTokenError,
  PasswordTooLongError,
  PasswordTooShortError,
  UnknownResetPasswordError,
  UnknownSignUpError,
  UnknownUsernameError,
  UsernameAlreadyExistsError,
} from "@/domain/auth/errors";
import { auth } from "@/lib/auth/server";
import { sendEmail } from "@/lib/email";
import WelcomeOnboardingEmail from "@/lib/email/templates/welcome-onboarding";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";

type SignUpParams = {
  username: string;
  email: string;
  password: string;
};

export const signUp = async ({ username, email, password }: SignUpParams) => {
  const existingUserWithUsername = await prisma.users.findMany({
    where: { username: { equals: username, mode: "insensitive" } },
  });

  if (existingUserWithUsername.length > 0) {
    throw new UsernameAlreadyExistsError();
  }

  let response;
  try {
    response = await auth.api.signUpEmail({
      body: {
        email: email as string,
        password: password as string,
        name: username as string,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (
        error.body?.code === "USER_ALREADY_EXISTS" ||
        error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
      ) {
        throw new EmailAlreadyExistsError();
      } else if (error.body?.code === "PASSWORD_TOO_SHORT") {
        throw new PasswordTooShortError();
      } else if (error.body?.code === "PASSWORD_TOO_LONG") {
        throw new PasswordTooLongError();
      }
    }

    console.error(error);
    throw new UnknownSignUpError();
  }

  try {
    await prisma.users.create({
      data: {
        id: response.user.id,
        username: username as string,
      },
    });
  } catch (error) {
    // Force delete the BetterAuth user from the database if the second
    // creation fails. We do not want to use the `auth.api.deleteUser()`
    // method because it would require to send an email to the user to
    // properly delete its record.

    await prisma.betterAuthUsers.delete({
      where: {
        id: response.user.id,
      },
    });

    console.error(error);
    throw new UnknownSignUpError();
  }

  return response.user.id;
};

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2002";

type CompleteOnboardingParams = {
  userId: string;
  username: string;
};

export const completeOnboarding = async ({
  userId,
  username,
}: CompleteOnboardingParams) => {
  const existingUser = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (existingUser) {
    return;
  }

  const existingUserWithUsername = await prisma.users.findMany({
    where: { username: { equals: username, mode: "insensitive" } },
  });

  if (existingUserWithUsername.length > 0) {
    throw new UsernameAlreadyExistsError();
  }

  let betterAuthUser;
  try {
    [, betterAuthUser] = await prisma.$transaction([
      prisma.users.create({
        data: { id: userId, username },
      }),

      prisma.betterAuthUsers.update({
        where: { id: userId },
        data: { name: username },
      }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new UsernameAlreadyExistsError();
    }

    console.error(error);
    throw new UnknownUsernameError();
  }

  try {
    const t = await getTranslations();

    await sendEmail(
      betterAuthUser.email,
      t("email.welcomeOnboarding.subject"),
      WelcomeOnboardingEmail,
      { username },
    );
  } catch (error) {
    // The account is fully set up at this point, so a failed welcome email
    // should not fail the onboarding.
    console.error(error);
  }
};

type UpdateUsernameParams = {
  userId: string;
  username: string;
};

export const updateUsername = async ({
  userId,
  username,
}: UpdateUsernameParams) => {
  const existingUserWithUsername = await prisma.users.findMany({
    where: {
      username: { equals: username, mode: "insensitive" },
      NOT: { id: userId },
    },
  });

  if (existingUserWithUsername.length > 0) {
    throw new UsernameAlreadyExistsError();
  }

  try {
    await prisma.$transaction([
      prisma.users.update({
        where: { id: userId },
        data: { username },
      }),

      prisma.betterAuthUsers.update({
        where: { id: userId },
        data: { name: username },
      }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new UsernameAlreadyExistsError();
    }

    console.error(error);
    throw new UnknownUsernameError();
  }
};

type PasswordForgottenParams = {
  email: string;
};

export const passwordForgotten = async ({ email }: PasswordForgottenParams) => {
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: Routes.RESET_PASSWORD,
    },
  });
};

type ResetPasswordParams = {
  token: string;
  newPassword: string;
};

export const resetPassword = async ({
  token,
  newPassword,
}: ResetPasswordParams) => {
  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === "INVALID_TOKEN") {
        throw new InvalidTokenError();
      }
    }

    console.error(error);
    throw new UnknownResetPasswordError();
  }
};

export const isUserVerified = async (email: string) => {
  const user = await prisma.betterAuthUsers.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  return user.emailVerified;
};
