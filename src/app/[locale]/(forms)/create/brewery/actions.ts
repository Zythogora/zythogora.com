"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { createBrewerySchema } from "@/app/[locale]/(forms)/create/brewery/schemas";
import { createBrewery } from "@/domain/breweries";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const createBreweryAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: Routes.SIGN_IN, locale });
  }

  const submission = parseWithZod(formData, {
    schema: createBrewerySchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  const brewery = await createBrewery(submission.value);

  redirect({
    href: generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
    locale,
  });
};
