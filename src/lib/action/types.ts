import type { MessageKeys } from "@/lib/i18n/types";

export type ActionResult<T> =
  | { success: true; data?: T }
  | { success: false; translationKey: MessageKeys };
