import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/lib/auth/server";
import { publicConfig } from "@/lib/config/client-config";

export const authClient = createAuthClient({
  baseURL: publicConfig.baseUrl,
  plugins: [customSessionClient<typeof auth>()],
});
