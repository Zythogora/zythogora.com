import { z } from "zod";

import { countryCodes } from "@/lib/i18n/countries";

export const zCountryCode = z
  .string({ message: "form.errors.FIELD_REQUIRED" })
  .refine((code) => countryCodes.includes(code), {
    message: "form.errors.COUNTRY_CODE_INVALID",
  });
