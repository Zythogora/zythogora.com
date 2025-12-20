"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { getLocale } from "next-intl/server";

import { createBrewerySchema } from "@/app/[locale]/(business)/(without-header)/create/brewery/schemas";
import { createBrewery } from "@/domain/breweries";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const createBreweryAction = async (
  pathname: string,
  redirectUrl: string | null,
  prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: { redirect: pathname },
      },
      locale,
    });
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
    href: redirectUrl
      ? redirectUrl
      : generatePath(Routes.BREWERY, { brewerySlug: brewery.slug }),
    locale,
  });
};
