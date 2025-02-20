"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { signInSchema } from "@/app/[locale]/(auth)/sign-in/schemas";
import { signIn } from "@/domain/auth";
import {
  CredentialsInvalidError,
  EmailNotVerifiedError,
  UnknownSignInError,
} from "@/domain/auth/errors";
import { redirect } from "@/lib/i18n";

export const signInAction = async (prevState: unknown, formData: FormData) => {
  const locale = await getLocale();

  const submission = parseWithZod(formData, {
    schema: signInSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  try {
    await signIn(submission.value);
  } catch (error) {
    if (error instanceof CredentialsInvalidError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["auth.signIn.errors.CREDENTIALS_INVALID"],
      });
    } else if (error instanceof EmailNotVerifiedError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["auth.signIn.errors.EMAIL_NOT_VERIFIED"],
      });
    } else if (error instanceof UnknownSignInError) {
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

  redirect({ href: submission.value.redirectUrl, locale });
};
