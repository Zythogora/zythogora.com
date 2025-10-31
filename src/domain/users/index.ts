"server only";

import { cache } from "react";

import { transformRawBeerReviewToBeerReviewWithPicture } from "@/domain/reviews/transforms";
import {
  AlreadyFriendsError,
  AlreadySentFriendRequestError,
  FriendRequestAcceptedError,
  FriendRequestRejectedError,
  InvalidFriendRequestError,
  UnauthorizedFriendRequestApprovalError,
  UnauthorizedFriendRequestError,
  UnauthorizedFriendRequestRejectionError,
  UnauthorizedFriendshipStatusCallError,
  UnknownFriendRequestError,
  UnknownFriendshipError,
  UnknownReviewError,
  UnknownUserError,
} from "@/domain/users/errors";
import {
  transformRawFriendRequestToFriendRequest,
  transformRawReviewToReview,
  transformRawUserReviewToUserReview,
  transformRawUserToUser,
} from "@/domain/users/transforms";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import FriendRequestEmail from "@/lib/email/templates/friend-request";
import FriendRequestAcceptedEmail from "@/lib/email/templates/friend-request-accepted";
import { getTranslationsByLocale } from "@/lib/i18n";
import { getPaginatedResults } from "@/lib/pagination";
import prisma, { getPrismaTransactionClient } from "@/lib/prisma";

import type {
  UserReview,
  User,
  Review,
  FriendRequest,
  FriendshipStatus,
} from "@/domain/users/types";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";
import type { PrismaTransactionClient } from "@/lib/prisma/types";

export const getUserByUsername = cache(
  async (username: string): Promise<User> => {
    const [[user], [stats]] = await Promise.all([
      prisma.users.findMany({
        where: { username: { equals: username, mode: "insensitive" } },
        include: { _count: { select: { reviews: true } } },
      }),
      prisma.$queryRaw`
        SELECT
          COUNT(DISTINCT reviews.beer_id) AS unique_beers,
          COUNT(DISTINCT breweries.id) AS unique_breweries,
          COUNT(DISTINCT beers.style_id) AS unique_styles,
          COUNT(DISTINCT breweries.country_alpha_2_code) AS unique_countries
        FROM public.reviews
        LEFT JOIN public.users ON reviews.user_id = users.id
        LEFT JOIN beer_data.beers ON reviews.beer_id = beers.id
        LEFT JOIN beer_data.breweries ON beers.brewery_id = breweries.id
        WHERE LOWER(users.username) = LOWER(${username});
      ` as Promise<
        {
          unique_beers: bigint;
          unique_breweries: bigint;
          unique_styles: bigint;
          unique_countries: bigint;
        }[]
      >,
    ]);

    if (!user || !stats) {
      throw new UnknownUserError();
    }

    return transformRawUserToUser({
      ...user,
      ...stats,
    });
  },
);

export const getReviewsByUser = cache(
  async ({
    userId,
    limit = 20,
    page = 1,
  }: PaginationParams<{ userId: string }>): Promise<
    PaginatedResults<UserReview>
  > => {
    const [rawReviews, reviewCount] = await Promise.all([
      prisma.reviews.findMany({
        where: { userId },
        include: {
          beer: {
            include: {
              brewery: true,
              color: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.reviews.count({
        where: { userId },
      }),
    ]);

    const reviews = await Promise.all(
      rawReviews.map(transformRawUserReviewToUserReview),
    );

    return getPaginatedResults(reviews, reviewCount, page, limit);
  },
);

export const getLatestPicturesByUser = async ({
  userId,
  count = 5,
}: {
  userId: string;
  count?: number;
}) => {
  return prisma.reviews
    .findMany({
      where: { userId, pictureUrl: { not: null } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: count,
    })
    .then((rawReviews) =>
      rawReviews.map(transformRawBeerReviewToBeerReviewWithPicture),
    );
};

export const getReviewByUsernameAndSlug = cache(
  async (username: string, reviewSlug: string): Promise<Review> => {
    const [user] = await prisma.users.findMany({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (!user) {
      throw new UnknownUserError();
    }

    const review = await prisma.reviews.findUnique({
      where: {
        slug_userId: {
          slug: reviewSlug,
          userId: user.id,
        },
      },
      include: {
        user: true,
        beer: { include: { brewery: true, style: true } },
      },
    });

    if (!review) {
      throw new UnknownReviewError();
    }

    return transformRawReviewToReview(review);
  },
);

export const getFriendshipStatus = async (
  userId: string,
): Promise<FriendshipStatus> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendshipStatusCallError();
  }

  if (userId === user.id) {
    throw new InvalidFriendRequestError();
  }

  const [friendship, friendRequests] = await getPrismaTransactionClient()(
    (tx) =>
      Promise.all([
        tx.friends.findFirst({
          where: { userAId: user.id, userBId: userId },
        }),

        tx.friendRequests.findMany({
          where: {
            OR: [
              { requesterId: user.id, addresseeId: userId },
              { requesterId: userId, addresseeId: user.id },
            ],
          },
        }),
      ]),
  );

  if (friendship) {
    return "FRIENDS";
  }

  if (
    friendRequests.some(
      (request) =>
        request.status === "PENDING" && request.addresseeId === userId,
    )
  ) {
    return "PENDING_APPROVAL";
  }

  if (
    friendRequests.some(
      (request) =>
        request.status === "PENDING" && request.addresseeId === user.id,
    )
  ) {
    return "REQUEST_RECEIVED";
  }

  if (
    friendRequests.some(
      (request) =>
        request.status === "REJECTED" && request.requesterId === user.id,
    )
  ) {
    return "REQUEST_REJECTED";
  }

  return "NOT_FRIENDS";
};

export const sendFriendRequest = async (addresseeId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendRequestError();
  }

  if (addresseeId === user.id) {
    throw new InvalidFriendRequestError();
  }

  await getPrismaTransactionClient()(async (tx) => {
    const existingFriendship = await tx.friends.findFirst({
      where: { userAId: user.id, userBId: addresseeId },
    });

    if (existingFriendship) {
      throw new AlreadyFriendsError();
    }

    const existingFriendRequest = await tx.friendRequests.findUnique({
      where: { requesterId_addresseeId: { requesterId: user.id, addresseeId } },
    });

    if (existingFriendRequest && existingFriendRequest.status === "PENDING") {
      throw new AlreadySentFriendRequestError();
    }

    if (existingFriendRequest && existingFriendRequest.status === "REJECTED") {
      throw new FriendRequestRejectedError();
    }

    const existingIncomingFriendRequest = await tx.friendRequests.findUnique({
      where: {
        requesterId_addresseeId: {
          requesterId: addresseeId,
          addresseeId: user.id,
        },
      },
    });

    // If the addressee has already sent a friend request,
    // accept it instead of sending a new one
    if (
      existingIncomingFriendRequest &&
      existingIncomingFriendRequest.status === "PENDING"
    ) {
      return _acceptFriendRequest(existingIncomingFriendRequest.id, tx);
    }

    const friendRequest = await tx.friendRequests.create({
      data: {
        requesterId: user.id,
        addresseeId,
      },
      include: {
        requester: true,
        addressee: { include: { betterAuthUser: true } },
      },
    });

    // TODO: Find a way to determine the locale of the addressee (profile settings?)
    const t = await getTranslationsByLocale("en");

    await sendEmail(
      friendRequest.addressee.betterAuthUser.email,
      t("email.friendRequest.subject"),
      FriendRequestEmail,
      {
        requesterUsername: friendRequest.requester.username,
        addresseeUsername: friendRequest.addressee.username,
        friendRequestId: friendRequest.id,
      },
    );
  });
};

export const acceptFriendRequest = async (
  friendRequestId: string,
): Promise<FriendRequest> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendRequestApprovalError();
  }

  return getPrismaTransactionClient()(async (tx) => {
    const friendRequest = await tx.friendRequests.findUnique({
      where: {
        id: friendRequestId,
        addresseeId: user.id,
      },
      include: { requester: true },
    });

    if (!friendRequest) {
      throw new UnknownFriendRequestError();
    }

    if (friendRequest.status === "ACCEPTED") {
      return transformRawFriendRequestToFriendRequest(
        friendRequest,
        "ALREADY_FRIENDS",
      );
    }

    if (friendRequest.status === "REJECTED") {
      throw new FriendRequestRejectedError();
    }

    return _acceptFriendRequest(friendRequestId, tx);
  });
};

export const acceptPreviouslyRejectedFriendRequest = async (
  friendRequestId: string,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendRequestApprovalError();
  }

  await getPrismaTransactionClient()(async (tx) => {
    const friendRequest = await tx.friendRequests.findUnique({
      where: {
        id: friendRequestId,
        addresseeId: user.id,
        status: "REJECTED",
      },
    });

    if (!friendRequest) {
      throw new UnknownFriendRequestError();
    }

    await _acceptFriendRequest(friendRequestId, tx);
  });
};

const _acceptFriendRequest = async (
  friendRequestId: string,
  transaction?: PrismaTransactionClient,
): Promise<FriendRequest> => {
  const friendRequest = await getPrismaTransactionClient(transaction)(
    async (tx) => {
      const now = new Date();

      const [updatedFriendRequest, friendship] = await Promise.all([
        tx.friendRequests.update({
          data: { status: "ACCEPTED", updatedAt: now },
          where: { id: friendRequestId },
          include: {
            requester: { include: { betterAuthUser: true } },
            addressee: true,
          },
        }),

        tx.friendships.create({ data: { since: now } }),
      ]);

      await tx.friends.createMany({
        data: [
          {
            friendshipId: friendship.id,
            userAId: updatedFriendRequest.requesterId,
            userBId: updatedFriendRequest.addresseeId,
          },
          {
            friendshipId: friendship.id,
            userAId: updatedFriendRequest.addresseeId,
            userBId: updatedFriendRequest.requesterId,
          },
        ],
      });

      return updatedFriendRequest;
    },
  );

  // TODO: Find a way to determine the locale of the requester (profile settings?)
  const t = await getTranslationsByLocale("en");

  await sendEmail(
    friendRequest.requester.betterAuthUser.email,
    t("email.friendRequestAccepted.subject"),
    FriendRequestAcceptedEmail,
    {
      requesterUsername: friendRequest.requester.username,
      addresseeUsername: friendRequest.addressee.username,
    },
  );

  return transformRawFriendRequestToFriendRequest(friendRequest, "ACCEPTED");
};

export const rejectFriendRequest = async (friendRequestId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendRequestRejectionError();
  }

  const friendRequest = await prisma.friendRequests.findUnique({
    where: {
      id: friendRequestId,
      addresseeId: user.id,
    },
  });

  if (!friendRequest) {
    throw new UnknownFriendRequestError();
  }

  if (friendRequest.status === "ACCEPTED") {
    throw new FriendRequestAcceptedError();
  }

  await prisma.friendRequests.update({
    data: { status: "REJECTED" },
    where: { id: friendRequestId },
    include: {
      requester: { include: { betterAuthUser: true } },
      addressee: true,
    },
  });
};

export const rejectPreviouslyAcceptedFriendRequest = async (
  friendRequestId: string,
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedFriendRequestRejectionError();
  }

  const friendRequest = await prisma.friendRequests.findUnique({
    where: {
      id: friendRequestId,
      addresseeId: user.id,
      status: "ACCEPTED",
    },
  });

  if (!friendRequest) {
    throw new UnknownFriendRequestError();
  }

  await getPrismaTransactionClient()(async (tx) => {
    const friendship = await tx.friends.findFirst({
      where: { userAId: user.id, userBId: friendRequest.requesterId },
    });

    // Should not happen, invalid database state
    if (!friendship) {
      console.error(
        `Unknown friendship between ${user.id} and ${friendRequest.requesterId}, however friend request ${friendRequestId} is accepted`,
      );
      throw new UnknownFriendshipError();
    }

    await Promise.all([
      tx.friendships.delete({
        where: { id: friendship.friendshipId },
      }),

      tx.friendRequests.update({
        data: { status: "REJECTED" },
        where: { id: friendRequestId },
        include: {
          requester: { include: { betterAuthUser: true } },
          addressee: true,
        },
      }),
    ]);
  });
};
