import { Button, Heading, Link, Preview, Text } from "@react-email/components";

import { publicConfig } from "@/lib/config/client-config";
import EmailTemplateLayout from "@/lib/email/templates/layout";
import { getTranslationsByLocale } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

interface FriendRequestEmailProps {
  requesterUsername: string;
  addresseeUsername: string;
  friendRequestId: string;
}

const FriendRequestEmail = async ({
  requesterUsername,
  addresseeUsername,
  friendRequestId,
}: FriendRequestEmailProps) => {
  // TODO: Find a way to determine the locale of the addressee (profile settings?)
  const t = await getTranslationsByLocale("en");

  const acceptFriendRequestUrl = `${publicConfig.baseUrl}${Routes.ACCEPT_FRIEND_REQUEST}?id=${friendRequestId}`;
  const rejectFriendRequestUrl = `${publicConfig.baseUrl}${Routes.DENY_FRIEND_REQUEST}?id=${friendRequestId}`;

  return (
    <EmailTemplateLayout>
      <Preview>{t("email.friendRequest.preview")}</Preview>

      <Heading as="h1">
        {t.rich("email.friendRequest.title", {
          br: () => <br />,
          highlight: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </Heading>

      <Text>
        {t.rich("email.friendRequest.text", {
          addresseeUsername,
          requesterUsername,
          br: () => <br />,
        })}
      </Text>

      <Text>{t("email.friendRequest.acceptCta")}</Text>

      <Button
        href={acceptFriendRequestUrl}
        className="bg-primary rounded-lg border-2 border-b-6 border-solid border-stone-950 px-16 py-4 text-sm font-bold text-stone-950"
      >
        {t("email.friendRequest.acceptButton")}
      </Button>

      <Text>
        {t.rich("email.friendRequest.acceptButtonFallback", {
          link: (chunks) => <Link href={acceptFriendRequestUrl}>{chunks}</Link>,
          acceptFriendRequestUrl,
        })}
      </Text>

      <Text>
        {t.rich("email.friendRequest.rejectCta", {
          requesterUsername,
          link: (chunks) => <Link href={rejectFriendRequestUrl}>{chunks}</Link>,
        })}
      </Text>
    </EmailTemplateLayout>
  );
};

export default FriendRequestEmail;
