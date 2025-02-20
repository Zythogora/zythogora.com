import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

import type { PropsWithChildren } from "react";

const SignUpLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: Routes.HOME, locale });
  }

  return children;
};

export default SignUpLayout;
