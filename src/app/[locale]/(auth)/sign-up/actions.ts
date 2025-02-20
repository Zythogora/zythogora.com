"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { signUpSchema } from "@/app/[locale]/(auth)/sign-up/schemas";
import { signUp } from "@/domain/auth";
import {
  EmailAlreadyExistsError,
  PasswordTooLongError,
  PasswordTooShortError,
  UnknownSignUpError,
  UsernameAlreadyExistsError,
} from "@/domain/auth/errors";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

export const signUpAction = async (prevState: unknown, formData: FormData) => {
  const locale = await getLocale();

  const submission = parseWithZod(formData, {
    schema: signUpSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  try {
    await signUp(submission.value);
  } catch (error) {
    if (error instanceof UsernameAlreadyExistsError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          username: ["auth.signUp.errors.USERNAME_ALREADY_EXISTS"],
        },
      });
    } else if (error instanceof EmailAlreadyExistsError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          email: ["auth.signUp.errors.EMAIL_ALREADY_EXISTS"],
        },
      });
    } else if (error instanceof PasswordTooShortError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          password: ["auth.signUp.errors.PASSWORD_TOO_SHORT"],
        },
      });
    } else if (error instanceof PasswordTooLongError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          password: ["auth.signUp.errors.PASSWORD_TOO_LONG"],
        },
      });
    } else if (error instanceof UnknownSignUpError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["form.errors.UNKNOWN_ERROR"],
      });
    } else {
      console.error(error);
      return submission.reply({
        resetForm: false,
        formErrors: ["form.errors.UNKNOWN_ERROR"],
      });
    }
  }

  redirect({
    href: Routes.SIGN_UP_VERIFICATION,
    locale,
  });
};
