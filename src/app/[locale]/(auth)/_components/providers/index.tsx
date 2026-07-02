"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

import Button from "@/app/_components/ui/button";
import { authClient } from "@/lib/auth/client";
import { getPathname } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { getSafeRedirectUrl } from "@/lib/routes/redirect";

interface SignInProvidersProps {
  availableProviders: string[];
}

const SignInProviders = ({ availableProviders }: SignInProvidersProps) => {
  const locale = useLocale();

  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirectUrl(searchParams.get("redirect"));

  const [isPending, setIsPending] = useState(false);

  const signIn = async (provider: "google") => {
    setIsPending(true);

    await authClient.signIn.social({
      provider,
      callbackURL: getPathname({ href: redirectUrl, locale }),
      newUserCallbackURL: getPathname({ href: Routes.WELCOME, locale }),
      errorCallbackURL: getPathname({ href: Routes.SIGN_IN, locale }),
    });
  };

  return (
    <div className="flex flex-row gap-x-6">
      {availableProviders.includes("apple") ? (
        <Button variant="outline" size="icon">
          <Image
            src="/auth/apple.svg"
            alt="Apple"
            width={28}
            height={28}
            className="h-7 w-fit"
          />
        </Button>
      ) : null}

      {availableProviders.includes("google") ? (
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          onClick={() => signIn("google")}
        >
          <Image src="/auth/google.svg" alt="Google" width={28} height={28} />
        </Button>
      ) : null}

      {availableProviders.includes("facebook") ? (
        <Button variant="outline" size="icon">
          <Image
            src="/auth/facebook.svg"
            alt="Facebook"
            width={28}
            height={28}
          />
        </Button>
      ) : null}
    </div>
  );
};

export default SignInProviders;
