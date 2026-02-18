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
import { recordError } from "@/lib/logger";

export const rejectPreviouslyAcceptedFriendRequestAction = async (
  friendRequestId: string,
) => {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  await rejectPreviouslyAcceptedFriendRequest(friendRequestId).catch(
    (error) => {
      if (
        !(error instanceof UnauthorizedFriendRequestRejectionError) &&
        !(error instanceof UnknownFriendRequestError) &&
        !(error instanceof UnknownFriendshipError)
      ) {
        recordError(error);
      }

      return { success: false };
    },
  );

  return { success: true };
};

export const acceptPreviouslyRejectedFriendRequestAction = async (
  friendRequestId: string,
) => {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  await acceptPreviouslyRejectedFriendRequest(friendRequestId).catch(
    (error) => {
      if (
        !(error instanceof UnauthorizedFriendRequestApprovalError) &&
        !(error instanceof UnknownFriendRequestError)
      ) {
        recordError(error);
      }

      return { success: false };
    },
  );

  return { success: true };
};
