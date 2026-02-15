import JsonLd from "@/app/_components/json-ld";
import type { User } from "@/domain/users/types";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { getAbsoluteUrl } from "@/lib/seo";

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

  return <JsonLd data={data} />;
};

export default UserJsonLd;
