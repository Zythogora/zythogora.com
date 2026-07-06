"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";

import { resetPasswordAction } from "@/app/[locale]/(auth)/reset-password/actions";
import { resetPasswordSchema } from "@/app/[locale]/(auth)/reset-password/schemas";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [lastResult, action] = useActionState(resetPasswordAction, undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (lastResult?.status === "success") {
      toast.success(t("auth.resetPassword.success"));

      router.push(`${Routes.SIGN_IN}?passwordResetSuccess=true`);
    }
  }, [lastResult, router, t]);

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
    <form
      {...getFormProps(form)}
      action={action}
      className="flex w-full flex-col gap-y-8"
    >
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-1">
          <Label htmlFor={fields.password.id}>
            {t("form.fields.password.label")}
          </Label>

          <div>
            <div className="m-px">
              <div
                className={cn(
                  "flex flex-col rounded-[7px] *:-m-px",
                  "shadow-hard-drop [--hard-shadow-spread:1px]",
                  "focus-within:outline-3 focus-within:outline-offset-1",
                  "focus-within:outline-primary-700 dark:focus-within:outline-primary-100",
                  "has-aria-invalid:[--hard-shadow-color:var(--color-red-800)]",
                  "**:data-[slot=input-container]:rounded-none **:data-[slot=input-container]:shadow-none",
                  "**:data-[slot=input-container]:focus-within:z-50!",
                  "**:data-[slot=input-container]:has-aria-invalid:z-40",
                  "**:data-[slot=input]:rounded-none",
                )}
              >
                <Input
                  {...getInputProps(fields.password, {
                    type: "password",
                    ariaAttributes: true,
                  })}
                  key={fields.password.key}
                  disabled={isPending}
                  placeholder={t("form.fields.password.placeholder")}
                  className={cn("rounded-t", "*:data-[slot=input]:rounded-t!")}
                />

                <Input
                  {...getInputProps(fields.confirmPassword, {
                    type: "password",
                    ariaAttributes: true,
                  })}
                  key={fields.confirmPassword.key}
                  disabled={isPending}
                  placeholder={t("form.fields.confirmPassword.placeholder")}
                  className={cn("rounded-b", "*:data-[slot=input]:rounded-b!")}
                />
              </div>
            </div>

            {fields.password.errors ? (
              <FormError
                id={fields.password.errorId}
                errors={fields.password.errors}
              />
            ) : (
              <FormError
                id={fields.confirmPassword.errorId}
                errors={fields.confirmPassword.errors}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("auth.resetPassword.actions.resetPending")
            : t("auth.resetPassword.actions.reset")}
        </Button>

        {lastResult?.error?.[""] ? (
          <FormError
            id={form.errorId}
            errors={lastResult?.error?.[""] ?? []}
            className="my-0 h-fit"
          />
        ) : null}
      </div>
    </form>
  );
};

export default ResetPasswordForm;
