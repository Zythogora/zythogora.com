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
    <form {...getFormProps(form)} className="flex w-full flex-col gap-y-8">
      <div className="flex flex-col gap-y-8">
        <FormInput
          label={t("form.fields.username.label")}
          placeholder={t("form.fields.username.placeholder")}
          type="text"
          field={fields.username}
          disabled={isPending}
          className={{
            input: "aria-invalid:border-red-800",
            inputContainer: "has-aria-invalid:before:bg-red-800",
            error: "text-red-900",
          }}
        />

        <FormInput
          label={t("form.fields.email.label")}
          placeholder={t("form.fields.email.placeholder")}
          type="email"
          field={fields.email}
          disabled={isPending}
          className={{
            input: "aria-invalid:border-red-800",
            inputContainer: "has-aria-invalid:before:bg-red-800",
            error: "text-red-900",
          }}
        />

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
        <Button
          type="submit"
          disabled={isPending}
          variant="outline"
          className="w-full"
        >
          {isPending
            ? t("auth.signUp.actions.signUpPending")
            : t("auth.signUp.actions.signUp")}
        </Button>

        <div className="flex flex-row-reverse items-center justify-between">
          <Link href="" className="font-title pr-3 text-sm font-medium">
            {t("auth.signUp.actions.signIn")}
          </Link>

          {lastResult?.error?.[""] ? (
            <FormError
              id={form.errorId}
              errors={lastResult?.error?.[""] ?? []}
              className="my-0 h-fit text-red-900"
            />
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
