"use client";

import { createAuthClient } from "better-auth/react";

import { config } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: config.baseUrl,
});
