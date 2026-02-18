import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import RejectButton from "@/app/[locale]/(business)/(with-header)/friend-requests/accept/_components/reject-button";
import { friendRequestSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/friend-requests/schemas";
import { acceptFriendRequest } from "@/domain/users";
import {
  FriendRequestRejectedError,
  UnauthorizedFriendRequestApprovalError,
  UnknownFriendRequestError,
} from "@/domain/users/errors";
import { Link, redirect } from "@/lib/i18n";
import { recordError } from "@/lib/logger";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

const AcceptFriendRequestPage = async ({
  params,
  searchParams,
}: PageProps<"/[locale]/friend-requests/accept">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const searchParamsResult = friendRequestSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return notFound();
  }

  const { id: friendRequestId } = searchParamsResult.data;

  const friendRequest = await acceptFriendRequest(friendRequestId).catch(
    (error) => {
      if (error instanceof UnauthorizedFriendRequestApprovalError) {
        const pathname = `${Routes.ACCEPT_FRIEND_REQUEST}?id=${friendRequestId}`;

        return redirect({
          href: `${Routes.SIGN_IN}?redirect=${encodeURIComponent(pathname)}`,
          locale,
        });
      }

      if (error instanceof UnknownFriendRequestError) {
        return notFound();
      }

      if (error instanceof FriendRequestRejectedError) {
        return redirect({
          href: `${generatePath(Routes.DENY_FRIEND_REQUEST)}?id=${friendRequestId}`,
          locale,
        });
      }

      recordError(error);
      return null;
    },
  );

  if (!friendRequest) {
    return (
      <p className="text-destructive">
        {t("friendRequestPage.errors.friendRequestAcceptingError")}
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-y-4">
        <p className="font-title text-2xl font-semibold">
          {
            {
              ACCEPTED: t("friendRequestPage.title.accepted"),
              ALREADY_FRIENDS: t("friendRequestPage.title.alreadyFriends"),
            }[friendRequest.status]
          }
        </p>

        <Link
          href={generatePath(Routes.PROFILE, {
            username: friendRequest.friend.username,
          })}
          className="text-primary-700 underline"
        >
          {t("friendRequestPage.cta.visitProfile", {
            username: friendRequest.friend.username,
          })}
        </Link>
      </div>

      <div className="flex flex-col items-center gap-y-4">
        <p>{t("friendRequestPage.actions.reject.cta")}</p>

        <Suspense>
          <RejectButton friendRequestId={friendRequestId} />
        </Suspense>
      </div>
    </>
  );
};

export default AcceptFriendRequestPage;
