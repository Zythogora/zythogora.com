"use server";

import { sendFriendRequest } from "@/domain/users";
import { getCurrentUser } from "@/lib/auth";

export const addFriend = async (userId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false };
  }

  try {
    await sendFriendRequest(userId);
  } catch (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
};
