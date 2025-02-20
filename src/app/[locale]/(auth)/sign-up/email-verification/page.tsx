import { MailCheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";

const SignUpEmailVerificationPage = async () => {
  const t = await getTranslations();

  return (
    <div className="bg-primary flex size-full flex-col items-center justify-center gap-y-8 px-4">
      <div className="flex flex-col items-center gap-y-4">
        <MailCheckIcon className="size-12 stroke-2" />

        <h1 className="font-title text-center text-2xl">
          {t.rich("auth.emailVerification.title", {
            br: () => <br />,
          })}
        </h1>
      </div>

      <p className="text-center">
        {t.rich("auth.emailVerification.text", {
          br: () => <br />,
          link: (chunks) => (
            <Link href={Routes.SIGN_IN} className="text-primary-800 underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
};

export default SignUpEmailVerificationPage;
