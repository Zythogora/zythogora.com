import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import AcceptButton from "@/app/[locale]/(business)/(with-header)/friend-requests/deny/_components/accept-button";
import { friendRequestSearchParamsSchema } from "@/app/[locale]/(business)/(with-header)/friend-requests/schemas";
import { rejectFriendRequest } from "@/domain/users";
import {
  FriendRequestAcceptedError,
  UnauthorizedFriendRequestRejectionError,
  UnknownFriendRequestError,
} from "@/domain/users/errors";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface RejectFriendRequestPageProps {
  searchParams: Promise<{
    id: string;
  }>;
}

const RejectFriendRequestPage = async ({
  searchParams,
}: RejectFriendRequestPageProps) => {
  const t = await getTranslations();

  const locale = await getLocale();

  const searchParamsResult = friendRequestSearchParamsSchema.safeParse(
    await searchParams,
  );

  if (!searchParamsResult.success) {
    return notFound();
  }

  const { id: friendRequestId } = searchParamsResult.data;

  const success = await rejectFriendRequest(friendRequestId).catch((error) => {
    if (error instanceof UnauthorizedFriendRequestRejectionError) {
      const pathname = `${Routes.DENY_FRIEND_REQUEST}?id=${friendRequestId}`;

      return redirect({
        href: `${Routes.SIGN_IN}?redirect=${encodeURIComponent(pathname)}`,
        locale,
      });
    }

    if (error instanceof UnknownFriendRequestError) {
      return notFound();
    }

    if (error instanceof FriendRequestAcceptedError) {
      return redirect({
        href: `${generatePath(Routes.ACCEPT_FRIEND_REQUEST)}?id=${friendRequestId}`,
        locale,
      });
    }

    console.error(error);
    return false;
  });

  if (success === false) {
    return (
      <p className="text-destructive">
        {t("friendRequestPage.errors.friendRequestRejectingError")}
      </p>
    );
  }

  return (
    <>
      <p className="font-title text-2xl font-semibold">
        {t("friendRequestPage.title.rejected")}
      </p>

      <div className="flex flex-col items-center gap-y-4">
        <p>{t("friendRequestPage.actions.accept.cta")}</p>

        <AcceptButton friendRequestId={friendRequestId} />
      </div>
    </>
  );
};

export default RejectFriendRequestPage;
