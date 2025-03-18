import { Heading, Link, Preview, Text } from "@react-email/components";

import { publicConfig } from "@/lib/config/client-config";
import EmailTemplateLayout from "@/lib/email/templates/layout";
import { getTranslationsByLocale } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface FriendRequestAcceptedEmailProps {
  requesterUsername: string;
  addresseeUsername: string;
}

const FriendRequestAcceptedEmail = async ({
  requesterUsername,
  addresseeUsername,
}: FriendRequestAcceptedEmailProps) => {
  // TODO: Find a way to determine the locale of the requester (profile settings?)
  const t = await getTranslationsByLocale("en");

  return (
    <EmailTemplateLayout>
      <Preview>
        {t("email.friendRequestAccepted.preview", { addresseeUsername })}
      </Preview>

      <Heading as="h1">
        {t.rich("email.friendRequestAccepted.title", {
          br: () => <br />,
          highlight: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </Heading>

      <Text>
        {t.rich("email.friendRequestAccepted.text", {
          addresseeUsername,
          requesterUsername,
          br: () => <br />,
        })}
      </Text>

      <Text>
        {t.rich("email.friendRequestAccepted.profileCta", {
          link: (chunks) => (
            <Link
              href={`${publicConfig.baseUrl}${generatePath(Routes.PROFILE, {
                username: addresseeUsername,
              })}`}
            >
              {chunks}
            </Link>
          ),
        })}
      </Text>
    </EmailTemplateLayout>
  );
};

export default FriendRequestAcceptedEmail;
