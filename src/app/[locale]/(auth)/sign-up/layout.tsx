import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const SignUpLayout = async ({
  children,
  params,
}: LayoutProps<"/[locale]/sign-up">) => {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect({ href: Routes.HOME, locale });
  }

  return children;
};

export default SignUpLayout;
