import { Button, Heading, Link, Preview, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";

import EmailTemplateLayout from "@/lib/email/templates/layout";

interface WelcomeEmailProps {
  username: string;
  activationUrl: string;
}

const WelcomeEmail = async ({ username, activationUrl }: WelcomeEmailProps) => {
  const t = await getTranslations();

  return (
    <EmailTemplateLayout>
      <Preview>{t("email.welcome.preview")}</Preview>

      <Heading as="h1">
        {t.rich("email.welcome.title", {
          highlight: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </Heading>

      <Text>{t("email.welcome.text", { username })}</Text>

      <Text>{t("email.welcome.text2")}</Text>

      <Button
        href={activationUrl}
        className="bg-primary rounded-lg border-2 border-b-6 border-solid border-stone-950 px-16 py-4 text-sm font-bold text-stone-950"
      >
        {t("email.welcome.button")}
      </Button>

      <Text>
        {t.rich("email.welcome.buttonFallback", {
          link: (chunks) => <Link href={activationUrl}>{chunks}</Link>,
          activationUrl,
        })}
      </Text>
    </EmailTemplateLayout>
  );
};

export default WelcomeEmail;
