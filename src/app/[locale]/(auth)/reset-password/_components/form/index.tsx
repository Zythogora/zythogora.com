"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { resetPasswordAction } from "@/app/[locale]/(auth)/reset-password/actions";
import { resetPasswordSchema } from "@/app/[locale]/(auth)/reset-password/schemas";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { redirect } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const t = useTranslations();

  const locale = useLocale();

  const [lastResult, action] = useActionState(resetPasswordAction, undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (lastResult?.status === "success") {
      toast.success(t("auth.resetPassword.success"));

      redirect({ href: `${Routes.SIGN_IN}?passwordResetSuccess=true`, locale });
    }
  }, [lastResult, locale, t]);

  const [form, fields] = useForm({
    lastResult,

    constraint: getZodConstraint(resetPasswordSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form {...getFormProps(form)} className="flex w-full flex-col gap-y-8">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-1">
          <Label htmlFor={fields.password.id}>
            {t("form.fields.password.label")}
          </Label>

          <div>
            <div className="flex flex-col">
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                disabled={isPending}
                key={fields.password.key}
                placeholder={t("form.fields.password.placeholder")}
                className={cn(
                  "rounded-b-none border-b-0",
                  "aria-invalid:border-red-800",
                )}
                containerClassName={cn(
                  "before:rounded-b-none has-aria-invalid:before:bg-red-800",
                  "before:rectangular-drop-shadow hover:before:triangular-drop-shadow has-focus-visible:before:triangular-drop-shadow",
                )}
              />

              <Input
                {...getInputProps(fields.confirmPassword, {
                  type: "password",
                })}
                key={fields.confirmPassword.key}
                disabled={isPending}
                placeholder={t("form.fields.confirmPassword.placeholder")}
                className={cn(
                  "rounded-t-none border-t-2",
                  "aria-invalid:border-red-800",
                )}
                containerClassName="has-aria-invalid:before:bg-red-800"
              />
            </div>

            {fields.password.errors ? (
              <FormError
                id={fields.password.errorId}
                errors={fields.password.errors}
                className="text-red-900"
              />
            ) : (
              <FormError
                id={fields.confirmPassword.errorId}
                errors={fields.confirmPassword.errors}
                className="text-red-900"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? t("auth.resetPassword.actions.resetPending")
            : t("auth.resetPassword.actions.reset")}
        </Button>

        {lastResult?.error?.[""] ? (
          <FormError
            id={form.errorId}
            errors={lastResult?.error?.[""] ?? []}
            className="my-0 h-fit text-red-900"
          />
        ) : null}
      </div>
    </form>
  );
};

export default ResetPasswordForm;
