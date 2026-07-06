"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { signInSchema } from "@/app/[locale]/(auth)/sign-in/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import { authClient } from "@/lib/auth/client";
import { Link, useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { getSafeRedirectUrl } from "@/lib/routes/redirect";
import { cn } from "@/lib/tailwind";

const SignInForm = () => {
  const t = useTranslations();
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectUrl = getSafeRedirectUrl(searchParams.get("redirect"));

  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, fields] = useForm({
    constraint: getZodConstraint(signInSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },

    async onSubmit(event, { formData }) {
      event.preventDefault();

      const submission = parseWithZod(formData, { schema: signInSchema });
      if (submission.status !== "success") {
        return submission.reply();
      }

      setIsPending(true);
      setFormError(null);

      const { error } = await authClient.signIn.email(submission.value);

      if (error) {
        setIsPending(false);

        if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
          setFormError("auth.signIn.errors.CREDENTIALS_INVALID");
        } else if (error.code === "EMAIL_NOT_VERIFIED") {
          setFormError("auth.signIn.errors.EMAIL_NOT_VERIFIED");
        } else {
          setFormError("form.errors.UNKNOWN_ERROR");
        }
        return;
      }

      router.push(redirectUrl);
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      {...getFormProps(form)}
      method="post"
      className={cn(
        "flex w-full flex-col gap-y-8",
        "**:data-[slot=input-container]:has-aria-invalid:[--hard-shadow-color:var(--color-red-800)] dark:**:data-[slot=input-container]:has-aria-invalid:[--hard-shadow-color:var(--color-destructive)]",
        "**:data-[slot=input]:focus-visible:outline-foreground",
        "dark:**:data-[slot=input]:aria-invalid:border-destructive **:data-[slot=input]:aria-invalid:border-red-800",
        "**:data-[slot=show-password-button]:focus-visible:outline-foreground",
        "dark:**:data-[slot=show-password-button]:group-has-aria-invalid/input:fill-destructive **:data-[slot=show-password-button]:group-has-aria-invalid/input:fill-red-800",
        "**:data-[slot=form-error]:text-red-900 dark:**:data-[slot=form-error]:text-red-200",
      )}
    >
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

        {formError ? (
          <FormError
            id={form.errorId}
            errors={[formError]}
            className="my-0 h-fit"
          />
        ) : null}
      </div>
    </form>
  );
};

export default SignInForm;
