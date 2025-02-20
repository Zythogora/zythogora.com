"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useRouter } from "@/lib/i18n";

export const useRouterWithSearchParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const push = useCallback(
    (pathname: string, queryParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else if (params.has(key)) {
          params.delete(key);
        }
      });

      router.push(pathname + "?" + params.toString());
    },
    [router, searchParams],
  );

  return { push };
};
