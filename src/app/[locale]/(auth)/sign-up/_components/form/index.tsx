"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState, useTransition } from "react";

import { signUpAction } from "@/app/[locale]/(auth)/sign-up/actions";
import { signUpSchema } from "@/app/[locale]/(auth)/sign-up/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

const SignUpForm = () => {
  const t = useTranslations();

  const [lastResult, action] = useActionState(signUpAction, undefined);
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    lastResult,

    constraint: getZodConstraint(signUpSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
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
      className={cn(
        "flex w-full flex-col gap-y-8",
        "**:data-[slot=input-container]:has-aria-invalid:before:bg-red-800",
        "**:data-[slot=input]:focus-visible:outline-foreground **:data-[slot=input]:aria-invalid:border-red-800",
        "**:data-[slot=show-password-button]:focus-visible:outline-foreground **:data-[slot=show-password-button]:group-has-aria-invalid/input:fill-red-800",
        "**:data-[slot=form-error]:text-red-900",
      )}
    >
      <FormInput
        label={t("form.fields.username.label")}
        placeholder={t("form.fields.username.placeholder")}
        type="text"
        field={fields.username}
        disabled={isPending}
      />

      <FormInput
        label={t("form.fields.email.label")}
        placeholder={t("form.fields.email.placeholder")}
        type="email"
        field={fields.email}
        disabled={isPending}
      />

      <div className="flex flex-col gap-y-1">
        <Label htmlFor={fields.password.id}>
          {t("form.fields.password.label")}
        </Label>

        <div>
          <div className="m-px">
            <div
              className={cn(
                "flex flex-col rounded-[7px] *:-m-px",
                "focus-within:outline-3 focus-within:outline-offset-1 focus-within:outline-stone-500",
                "before:bg-foreground relative before:absolute before:inset-[-1px] before:bottom-[-3px] before:z-[-1] before:rounded",
                "**:data-[slot=input-container]:rounded-none **:data-[slot=input-container]:focus-within:z-50!",
                "**:data-[slot=input-container]:before:bottom-0",
                "not-focus-within:**:data-[slot=input-container]:last-of-type:before:-bottom-0.5!",
                "**:data-[slot=input-container]:has-aria-invalid:z-40",
                "**:data-[slot=input]:rounded-none",
              )}
            >
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                key={fields.password.key}
                disabled={isPending}
                placeholder={t("form.fields.password.placeholder")}
                className={cn("rounded-t", "*:data-[slot=input]:rounded-t!")}
              />

              <Input
                {...getInputProps(fields.confirmPassword, { type: "password" })}
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

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending} variant="outline">
          {isPending
            ? t("auth.signUp.actions.signUpPending")
            : t("auth.signUp.actions.signUp")}
        </Button>

        <div className="flex flex-row-reverse items-center justify-between">
          <Link
            href={Routes.SIGN_IN}
            className={cn(
              "font-title mr-1 rounded px-2 py-1 text-sm font-medium",
              "focus-visible:outline-foreground focus-visible:outline-3",
            )}
          >
            {t("auth.signUp.actions.signIn")}
          </Link>

          {lastResult?.error?.[""] ? (
            <FormError
              id={form.errorId}
              errors={lastResult?.error?.[""] ?? []}
              className="my-0 h-fit"
            />
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
