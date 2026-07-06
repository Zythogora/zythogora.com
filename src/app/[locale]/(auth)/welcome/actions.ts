"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { getLocale } from "next-intl/server";

import { welcomeSchema } from "@/app/[locale]/(auth)/welcome/schemas";
import { completeOnboarding } from "@/domain/auth";
import { UsernameAlreadyExistsError } from "@/domain/auth/errors";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

export const completeOnboardingAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    return redirect({ href: Routes.SIGN_IN, locale });
  }

  const submission = parseWithZod(formData, {
    schema: welcomeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  try {
    await completeOnboarding({
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
