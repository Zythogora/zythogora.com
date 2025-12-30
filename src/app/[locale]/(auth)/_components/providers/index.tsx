"use client";

import Image from "next/image";

import Button from "@/app/_components/ui/button";
import { authClient } from "@/lib/auth/client";

interface SignInProvidersProps {
  availableProviders: string[];
}

const SignInProviders = ({ availableProviders }: SignInProvidersProps) => {
  const signIn = async (provider: "apple" | "google" | "facebook") => {
    await authClient.signIn.social({
      provider,
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
        <Button variant="outline" size="icon" onClick={() => signIn("google")}>
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
