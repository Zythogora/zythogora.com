import "server-only";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import { auth } from "@/lib/auth/server";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session.user;
});

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

// Unlike `getCurrentUser`, this helper never returns null: it redirects to
// the sign-in page when there is no session, and to the onboarding page when
// the user has not picked a username yet (social sign-up).
export const getCurrentUserOrRedirect = cache(
  async (opts?: { redirectTo?: string }) => {
    const user = await getCurrentUser();
    const locale = await getLocale();

    if (!user) {
      return redirect({
        href: opts?.redirectTo
          ? {
              pathname: Routes.SIGN_IN,
              query: { redirect: opts.redirectTo },
            }
          : Routes.SIGN_IN,
        locale,
      });
    }

    if (user.username === null) {
      return redirect({ href: Routes.WELCOME, locale });
    }

    return user as CurrentUser & { username: string };
  },
);
