"use server";

import { sendFriendRequest } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";

import type { ActionResult } from "@/lib/action/types";

export const addFriend = async (
  userId: string,
): Promise<ActionResult<void>> => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false, translationKey: "common.errors.unauthorized" };
  }

  try {
    await sendFriendRequest(userId);
  } catch (error) {
    console.error(error);
    return {
      success: false,
      translationKey: "profilePage.friendship.toasts.friendRequestSendingError",
    };
  }

  return { success: true };
};
