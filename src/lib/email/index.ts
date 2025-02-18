"server only";

import { Resend } from "resend";

import { config } from "@/lib/config";
import { EmailError } from "@/lib/email/errors";

import type { ReactNode } from "react";

const resend = new Resend(config.email.resendApiKey);

export const sendEmail = async <Data>(
  to: string,
  subject: string,
  template: (data: Data) => ReactNode,
  data: Data,
) => {
  const { data: email, error } = await resend.emails.send({
    from: config.email.from,
    to,
    subject,
    react: template(data),
  });

  if (error || !email) {
    console.error(error);
    throw new EmailError();
  }

  return email.id;
};
