import { Body, Html, Tailwind } from "@react-email/components";
import { getLocale } from "next-intl/server";

import type { PropsWithChildren } from "react";

const EmailTemplateLayout = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();

  return (
    <Html lang={locale}>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#FFAA00",
              },
            },
          },
        }}
      >
        <Body className="text-stone-950">{children}</Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplateLayout;
