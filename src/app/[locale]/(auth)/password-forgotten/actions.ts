"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { passwordForgottenSchema } from "@/app/[locale]/(auth)/password-forgotten/schemas";
import { passwordForgotten } from "@/domain/auth";

import type { SubmissionResult } from "@conform-to/react";

export const passwordForgottenAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const submission = parseWithZod(formData, {
    schema: passwordForgottenSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  await passwordForgotten({ email: submission.value.email });

  return {
    status: "success",
  } satisfies SubmissionResult;
};
