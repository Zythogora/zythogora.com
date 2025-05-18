"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { editProfileSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/edit/schemas";
import { updateUser } from "@/domain/auth";
import {
  NothingToUpdateError,
  UnauthorizedProfileUpdateError,
  UpdateProfileUsernameAlreadyExistsError,
} from "@/domain/auth/errors";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const editProfileAction = async (
  username: string,
  prevState: unknown,
  formData: FormData,
) => {
  const submission = parseWithZod(formData, {
    schema: editProfileSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  const locale = await getLocale();

  try {
    await updateUser(submission.value);
  } catch (error) {
    if (error instanceof UnauthorizedProfileUpdateError) {
      redirect({
        href: `${Routes.SIGN_IN}?redirect=${generatePath(Routes.EDIT_PROFILE, {
          username,
        })}`,
        locale,
      });
    }

    if (error instanceof NothingToUpdateError) {
      return submission.reply({
        resetForm: false,
        formErrors: ["editProfilePage.errors.NOTHING_TO_UPDATE"],
      });
    }

    if (error instanceof UpdateProfileUsernameAlreadyExistsError) {
      return submission.reply({
        resetForm: false,
        fieldErrors: {
          username: ["editProfilePage.errors.USERNAME_ALREADY_EXISTS"],
        },
      });
    }

    console.error(error);
    return submission.reply({
      resetForm: false,
      formErrors: ["form.errors.UNKNOWN_ERROR"],
    });
  }

  // redirect({
  //   href: generatePath(Routes.PROFILE, {
  //     username: submission.value.username ?? username,
  //   }),
  //   locale,
  // });
};
