import enMessages from "@/lib/i18n/translations/en.json";

import type { routing } from "@/lib/i18n";

export type Locale = (typeof routing.locales)[number];

type DotNotationKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : T[K] extends object
      ? DotNotationKeys<T[K], `${Prefix}${K & string}.`>
      : never;
}[keyof T];

export type Messages = typeof enMessages;
export type MessageKeys = DotNotationKeys<Messages>;
