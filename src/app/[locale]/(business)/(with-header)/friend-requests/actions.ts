"use server";

import {
  acceptPreviouslyRejectedFriendRequest,
  rejectPreviouslyAcceptedFriendRequest,
} from "@/domain/users";
import {
  UnauthorizedFriendRequestApprovalError,
  UnauthorizedFriendRequestRejectionError,
  UnknownFriendRequestError,
  UnknownFriendshipError,
} from "@/domain/users/errors";
import { getCurrentUser } from "@/lib/auth";

import type { ActionResult } from "@/lib/action/types";

export const rejectPreviouslyAcceptedFriendRequestAction = async (
  friendRequestId: string,
): Promise<ActionResult<void>> => {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, translationKey: "common.errors.unauthorized" };
  }

  try {
    await rejectPreviouslyAcceptedFriendRequest(friendRequestId);
  } catch (error) {
    if (
      !(error instanceof UnauthorizedFriendRequestRejectionError) &&
      !(error instanceof UnknownFriendRequestError) &&
      !(error instanceof UnknownFriendshipError)
    ) {
      console.error(error);
    }

    return {
      success: false,
      translationKey: "friendRequestPage.errors.friendRequestRejectingError",
    };
  }

  return { success: true };
};

export const acceptPreviouslyRejectedFriendRequestAction = async (
  friendRequestId: string,
): Promise<ActionResult<void>> => {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, translationKey: "common.errors.unauthorized" };
  }

  try {
    await acceptPreviouslyRejectedFriendRequest(friendRequestId);
  } catch (error) {
    if (
      !(error instanceof UnauthorizedFriendRequestApprovalError) &&
      !(error instanceof UnknownFriendRequestError)
    ) {
      console.error(error);
    }

    return {
      success: false,
      translationKey: "friendRequestPage.errors.friendRequestAcceptingError",
    };
  }

  return { success: true };
};
