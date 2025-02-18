import { APIError } from "better-auth/api";

import {
  EmailAlreadyExistsError,
  PasswordTooLongError,
  PasswordTooShortError,
  UnknownSignUpError,
  UsernameAlreadyExistsError,
} from "@/domain/auth/errors";
import { auth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

type SignUpParams = {
  username: string;
  email: string;
  password: string;
};

export const signUp = async ({ username, email, password }: SignUpParams) => {
  const existingUserWithUsername = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUserWithUsername !== null) {
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
      if (error.body.code === "USER_ALREADY_EXISTS") {
        throw new EmailAlreadyExistsError();
      } else if (error.body.code === "PASSWORD_TOO_SHORT") {
        throw new PasswordTooShortError();
      } else if (error.body.code === "PASSWORD_TOO_LONG") {
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
