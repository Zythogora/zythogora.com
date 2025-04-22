"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useTransition } from "react";

import { signInAction } from "@/app/[locale]/(auth)/sign-in/actions";
import { signInSchema } from "@/app/[locale]/(auth)/sign-in/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

const SignInForm = () => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? Routes.HOME;

  const [lastResult, action] = useActionState(signInAction, undefined);
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    lastResult,

    constraint: getZodConstraint(signInSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
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
      <input type="hidden" name="redirectUrl" value={redirectUrl} />

      <div className="flex flex-col gap-y-8">
        <FormInput
          label={t("form.fields.email.label")}
          placeholder={t("form.fields.email.placeholder")}
          type="email"
          field={fields.email}
          disabled={isPending}
        />

        <FormInput
          label={t("form.fields.password.label")}
          placeholder={t("form.fields.password.placeholder")}
          type="password"
          field={fields.password}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending} variant="outline">
          {isPending
            ? t("auth.signIn.actions.signInPending")
            : t("auth.signIn.actions.signIn")}
        </Button>

        <div className="flex flex-row flex-wrap items-center justify-between">
          <Link
            href={Routes.PASSWORD_FORGOTTEN}
            className={cn(
              "font-title mx-1 rounded px-2 py-1 text-sm font-medium",
              "focus-visible:outline-foreground",
            )}
          >
            {t("auth.signIn.actions.passwordForgotten")}
          </Link>

          <Link
            href={Routes.SIGN_UP}
            className={cn(
              "font-title mx-1 rounded px-2 py-1 text-sm font-medium",
              "focus-visible:outline-foreground",
            )}
          >
            {t("auth.signIn.actions.signUp")}
          </Link>
        </div>

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

export default SignInForm;
