import { Button, Heading, Preview, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";

import { publicConfig } from "@/lib/config/client-config";
import EmailTemplateLayout from "@/lib/email/templates/layout";

interface WelcomeOnboardingEmailProps {
  username: string;
}

const WelcomeOnboardingEmail = async ({
  username,
}: WelcomeOnboardingEmailProps) => {
  const t = await getTranslations();

  return (
    <EmailTemplateLayout>
      <Preview>{t("email.welcomeOnboarding.preview")}</Preview>

      <Heading as="h1">
        {t.rich("email.welcomeOnboarding.title", {
          highlight: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </Heading>

      <Text>{t("email.welcomeOnboarding.text", { username })}</Text>

      <Text>{t("email.welcomeOnboarding.text2")}</Text>

      <Button
        href={publicConfig.baseUrl}
        className="bg-primary rounded-lg border-2 border-b-6 border-solid border-stone-950 px-16 py-4 text-sm font-bold text-stone-950"
      >
        {t("email.welcomeOnboarding.button")}
      </Button>
    </EmailTemplateLayout>
  );
};

export default WelcomeOnboardingEmail;
