"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { resetPasswordSchema } from "@/app/[locale]/(auth)/reset-password/schemas";
import { resetPassword } from "@/domain/auth";
import { InvalidTokenError } from "@/domain/auth/errors";

import type { SubmissionResult } from "@conform-to/react";

export const resetPasswordAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  try {
    await resetPassword({
      token: submission.value.token,
      newPassword: submission.value.password,
    });
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["auth.resetPassword.errors.INVALID_TOKEN"],
      });
    }

    console.error(error);
    return submission.reply({
      resetForm: false,
    });
  }

  return {
    status: "success",
  } satisfies SubmissionResult;
};
