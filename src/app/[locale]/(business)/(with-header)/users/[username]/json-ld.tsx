import JsonLd from "@/app/_components/json-ld";
import type { User } from "@/domain/users/types";
import { publicConfig } from "@/lib/config/client-config";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl, getBreadcrumbListJsonLd } from "@/lib/seo";

import type { Person as PersonJsonLdSchema, WithContext } from "schema-dts";

interface UserJsonLdProps {
  user: User;
}

const UserJsonLd = ({ user }: UserJsonLdProps) => {
  const userUrl = getAbsoluteUrl(
    generatePath(Routes.PROFILE, { username: user.username }),
  );

  const data: WithContext<PersonJsonLdSchema> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": userUrl,
    url: userUrl,
    name: user.username,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WriteAction" },
      userInteractionCount: user.reviewCount,
    },
  };

  const breadcrumb = getBreadcrumbListJsonLd([
    {
      name: publicConfig.appName,
      path: Routes.HOME,
    },
    {
      name: user.username,
      path: generatePath(Routes.PROFILE, { username: user.username }),
    },
  ]);

  return (
    <>
      <JsonLd data={data} />

      <JsonLd data={breadcrumb} />
    </>
  );
};

export default UserJsonLd;
