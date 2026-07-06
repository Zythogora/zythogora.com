"use client";

import { useEffect } from "react";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const OnboardingGuard = () => {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();

  useEffect(() => {
    if (!isPending && session && session.user.username === null) {
      router.replace(Routes.WELCOME);
    }
  }, [session, isPending, router]);

  return null;
};

export default OnboardingGuard;
