"use client";

import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";

import queryClient from "@/lib/tanstack-query";

import type { ComponentProps } from "react";

export const availableThemes = ["light", "dark"] as const;
export type Theme = (typeof availableThemes)[number] | "system";

const QueryClientProvider = (
  props: Omit<ComponentProps<typeof TanstackQueryClientProvider>, "client">,
) => {
  return <TanstackQueryClientProvider client={queryClient} {...props} />;
};

export default QueryClientProvider;
