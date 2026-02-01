import { z } from "zod";

import { ServingFrom } from "@db/enums";

import { cellarServingFormatValues } from "@/app/_components/ui/cellar-serving-format-selector";

export const cellarSearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  storageLocationId: z.string().optional(),
  servingFormat: z.enum([ServingFrom.BOTTLE, ServingFrom.CAN]).optional(),
  expiringWithinDays: z.coerce.number().optional(),
});

export const addToCellarSchema = z.object({
  beerId: z.string({
    error: () => "form.errors.FIELD_REQUIRED",
  }),
  quantity: z.coerce
    .number({
      error: () => "form.errors.FIELD_REQUIRED",
    })
    .min(1, "cellar.form.errors.QUANTITY_MIN"),
  servingFormat: z.enum(cellarServingFormatValues, {
    error: (issue) =>
      issue.input === undefined
        ? "form.errors.FIELD_REQUIRED"
        : "form.errors.ENUM_INVALID",
  }),
  bestBeforeDate: z.coerce.date().optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.coerce.number().positive().optional(),
  purchaseCurrency: z.string().length(3).optional(),
  storageLocationId: z.string().optional(),
  storageLocationName: z.string().optional(),
  purchaseLocationId: z.string().optional(),
});

export const adjustQuantitySchema = z.object({
  itemId: z.string(),
  delta: z.coerce.number().refine((val) => val === 1 || val === -1, {
    message: "Delta must be 1 or -1",
  }),
});

export const moveItemSchema = z.object({
  itemId: z.string(),
  storageLocationId: z.string().nullable(),
});

export const deleteItemSchema = z.object({
  itemId: z.string(),
});

export type AddToCellarData = z.infer<typeof addToCellarSchema>;
