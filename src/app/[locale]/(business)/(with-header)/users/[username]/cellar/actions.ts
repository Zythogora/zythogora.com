"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

import {
  addToCellarSchema,
  adjustQuantitySchema,
  deleteItemSchema,
  moveItemSchema,
} from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/schemas";
import {
  addToCellar,
  adjustCellarItemQuantity,
  deleteCellarItem,
  moveCellarItem,
} from "@/domain/cellar";
import { UnauthorizedCellarError, UnknownCellarItemError } from "@/domain/cellar/errors";
import { createStorageLocation } from "@/domain/storage-locations";
import { UnauthorizedStorageLocationError } from "@/domain/storage-locations/errors";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export const addToCellarAction = async (
  pathname: string,
  previousState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();

  const user = await getCurrentUser();
  if (!user) {
    return redirect({
      href: {
        pathname: Routes.SIGN_IN,
        query: { redirect: pathname },
      },
      locale,
    });
  }

  const submission = parseWithZod(formData, {
    schema: addToCellarSchema,
  });

  if (submission.status !== "success") {
    return submission.reply({
      resetForm: false,
    });
  }

  try {
    await addToCellar({
      beerId: submission.value.beerId,
      quantity: submission.value.quantity,
      servingFormat: submission.value.servingFormat,
      bestBeforeDate: submission.value.bestBeforeDate,
      purchaseDate: submission.value.purchaseDate,
      purchasePrice: submission.value.purchasePrice,
      purchaseCurrency: submission.value.purchaseCurrency,
      storageLocationId: submission.value.storageLocationId,
      storageLocationName: submission.value.storageLocationName,
      purchaseLocationId: submission.value.purchaseLocationId,
    });

    revalidatePath(generatePath(Routes.CELLAR, { username: user.username }));

    return submission.reply({ resetForm: true });
  } catch (error) {
    console.error("Failed to add to cellar:", error);
    return submission.reply({
      resetForm: false,
      formErrors: ["cellar.form.errors.SOMETHING_WENT_WRONG"],
    });
  }
};

export const adjustQuantityAction = async (
  previousState: unknown,
  formData: FormData,
) => {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const submission = parseWithZod(formData, {
    schema: adjustQuantitySchema,
  });

  if (submission.status !== "success") {
    return { error: "Invalid data" };
  }

  try {
    await adjustCellarItemQuantity(
      submission.value.itemId,
      submission.value.delta,
    );

    revalidatePath(generatePath(Routes.CELLAR, { username: user.username }));

    return { success: true };
  } catch (error) {
    if (error instanceof UnknownCellarItemError) {
      return { error: "Item not found" };
    }
    if (error instanceof UnauthorizedCellarError) {
      return { error: "Unauthorized" };
    }
    console.error("Failed to adjust quantity:", error);
    return { error: "Something went wrong" };
  }
};

export const moveItemAction = async (
  previousState: unknown,
  formData: FormData,
) => {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const submission = parseWithZod(formData, {
    schema: moveItemSchema,
  });

  if (submission.status !== "success") {
    return { error: "Invalid data" };
  }

  try {
    await moveCellarItem(
      submission.value.itemId,
      submission.value.storageLocationId,
    );

    revalidatePath(generatePath(Routes.CELLAR, { username: user.username }));

    return { success: true };
  } catch (error) {
    if (error instanceof UnknownCellarItemError) {
      return { error: "Item not found" };
    }
    if (error instanceof UnauthorizedCellarError) {
      return { error: "Unauthorized" };
    }
    console.error("Failed to move item:", error);
    return { error: "Something went wrong" };
  }
};

export const deleteItemAction = async (
  previousState: unknown,
  formData: FormData,
) => {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const submission = parseWithZod(formData, {
    schema: deleteItemSchema,
  });

  if (submission.status !== "success") {
    return { error: "Invalid data" };
  }

  try {
    await deleteCellarItem(submission.value.itemId);

    revalidatePath(generatePath(Routes.CELLAR, { username: user.username }));

    return { success: true };
  } catch (error) {
    if (error instanceof UnknownCellarItemError) {
      return { error: "Item not found" };
    }
    if (error instanceof UnauthorizedCellarError) {
      return { error: "Unauthorized" };
    }
    console.error("Failed to delete item:", error);
    return { error: "Something went wrong" };
  }
};

export const createStorageLocationAction = async (name: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  const location = await createStorageLocation(name);

  revalidatePath(generatePath(Routes.CELLAR, { username: user.username }));

  return location;
};
