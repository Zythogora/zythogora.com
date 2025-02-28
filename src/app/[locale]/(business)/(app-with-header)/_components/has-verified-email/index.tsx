"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

import { usePathname, useRouter } from "@/lib/i18n";

const HasVerifiedEmail = () => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");

    if (verified && verified === "true") {
      toast.success(t("auth.emailVerification.success"));

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("verified");

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [t, router, pathname, searchParams]);

  return null;
};

export default HasVerifiedEmail;
