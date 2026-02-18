"use server";

import { sendFriendRequest } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";
import { recordError } from "@/lib/logger";

export const addFriend = async (userId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false };
  }

  try {
    await sendFriendRequest(userId);
  } catch (error) {
    recordError(error);
    return { success: false };
  }

  return { success: true };
};
