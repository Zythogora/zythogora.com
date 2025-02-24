import { Button, Link, Preview, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";

import EmailTemplateLayout from "@/lib/email/templates/layout";

interface ResetPasswordEmailProps {
  username: string;
  resetPasswordUrl: string;
}

const ResetPasswordEmail = async ({
  username,
  resetPasswordUrl,
}: ResetPasswordEmailProps) => {
  const t = await getTranslations();

  return (
    <EmailTemplateLayout>
      <Preview>{t("email.resetPassword.preview")}</Preview>

      <Text>
        {t.rich("email.resetPassword.text", { username, br: () => <br /> })}
      </Text>

      <Text>{t("email.resetPassword.text2")}</Text>

      <Text>{t("email.resetPassword.text3")}</Text>

      <Button
        href={resetPasswordUrl}
        className="bg-primary rounded-lg border-2 border-b-6 border-solid border-stone-950 px-16 py-4 text-sm font-bold text-stone-950"
      >
        {t("email.resetPassword.button")}
      </Button>

      <Text>
        {t.rich("email.resetPassword.buttonFallback", {
          link: (chunks) => <Link href={resetPasswordUrl}>{chunks}</Link>,
          resetPasswordUrl,
        })}
      </Text>
    </EmailTemplateLayout>
  );
};

export default ResetPasswordEmail;
