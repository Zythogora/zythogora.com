"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { updateUsernameSchema } from "@/app/[locale]/(business)/(with-header)/settings/schemas";
import { updateUsername } from "@/domain/auth";
import { UsernameAlreadyExistsError } from "@/domain/auth/errors";
import { getCurrentUserOrRedirect } from "@/lib/auth";

export const updateUsernameAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const user = await getCurrentUserOrRedirect();

  const submission = parseWithZod(formData, {
    schema: updateUsernameSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  if (submission.value.username === user.username) {
    return submission.reply();
  }

  try {
    await updateUsername({
      userId: user.id,
      username: submission.value.username,
    });
  } catch (error) {
    if (error instanceof UsernameAlreadyExistsError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          username: ["auth.signUp.errors.USERNAME_ALREADY_EXISTS"],
        },
      });
    }

    return submission.reply({
      resetForm: false,
      formErrors: ["form.errors.UNKNOWN_ERROR"],
    });
  }

  return submission.reply();
};
