"use server";

import { parseWithZod } from "@conform-to/zod";
import { getLocale } from "next-intl/server";

import { reviewSchema } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

export const editReviewAction = async (
  pathname: string,
  previousState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: { pathname: Routes.SIGN_IN, query: { redirect: pathname } },
      locale,
    });
  }

  const submission = parseWithZod(formData, { schema: reviewSchema });

  if (submission.status !== "success") {
    return submission.reply({ resetForm: false });
  }

  console.log(submission.value);
};
