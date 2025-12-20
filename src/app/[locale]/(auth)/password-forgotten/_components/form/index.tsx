"use client";

import { useForm } from "@conform-to/react";
import { getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { getZodConstraint } from "@conform-to/zod/v4";
import { useTranslations } from "next-intl";
import { useActionState, useState, useTransition } from "react";

import { passwordForgottenAction } from "@/app/[locale]/(auth)/password-forgotten/actions";
import { passwordForgottenSchema } from "@/app/[locale]/(auth)/password-forgotten/schemas";
import Input from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";

interface PasswordForgottenFormProps {
  email: string;
}

const PasswordForgottenForm = ({ email }: PasswordForgottenFormProps) => {
  const t = useTranslations();

  const [lastResult, action] = useActionState(
    passwordForgottenAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [form, fields] = useForm({
    defaultValue: { email },

    lastResult,

    constraint: getZodConstraint(passwordForgottenSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: passwordForgottenSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        if (fields.email.value) {
          setSubmittedEmail(fields.email.value);
        }

        action(formData);
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form {...getFormProps(form)} className="flex w-full flex-col gap-y-8">
      <Input
        label={t("form.fields.email.label")}
        placeholder={t("form.fields.email.placeholder")}
        type="email"
        field={fields.email}
      />

      <Button type="submit" disabled={isPending}>
        {isPending
          ? t("auth.passwordForgotten.actions.sending")
          : t("auth.passwordForgotten.actions.send")}
      </Button>

      {!isPending ? (
        lastResult?.status === "success" ? (
          <p className="text-success">
            {t("auth.passwordForgotten.success", {
              email: submittedEmail,
            })}
          </p>
        ) : lastResult?.error?.[""] ? (
          <FormError
            id={form.errorId}
            errors={lastResult?.error?.[""] ?? []}
            className="my-0 h-fit"
          />
        ) : null
      ) : null}
    </form>
  );
};

export default PasswordForgottenForm;
