import type { RichTranslationValues } from "next-intl";
import type { ReactNode } from "react";

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

export type TFunction = {
  (key: RecursiveKeyOf<IntlMessages>, options?: Record<string, string>): string;
  rich(
    key: RecursiveKeyOf<IntlMessages>,
    options?: RichTranslationValues,
  ): ReactNode;
};
