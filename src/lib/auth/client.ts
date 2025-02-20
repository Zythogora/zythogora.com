import { createAuthClient } from "better-auth/react";

import { publicConfig } from "@/lib/config/client-config";

export const authClient = createAuthClient({
  baseURL: publicConfig.baseUrl,
});
