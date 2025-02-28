// Add data types to window.navigator ambiently for implicit use in the entire project.
/// <reference types="user-agent-data-types" />

import en from "./src/lib/i18n/translations/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}
