"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";

import { completeOnboardingAction } from "@/app/[locale]/(auth)/welcome/actions";
import { welcomeSchema } from "@/app/[locale]/(auth)/welcome/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

const WelcomeForm = () => {
  const t = useTranslations();
  const router = useRouter();

  const { refetch } = authClient.useSession();

  const [lastResult, action] = useActionState(
    completeOnboardingAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (lastResult?.status !== "success") {
      return;
    }

    (async () => {
      try {
        await refetch();
      } catch (error) {
        console.error(error);
      } finally {
        router.push(Routes.HOME);
      }
    })();
  }, [lastResult, refetch, router]);

  const [form, fields] = useForm({
    lastResult,

    constraint: getZodConstraint(welcomeSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: welcomeSchema });
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

  const isDone = lastResult?.status === "success";

  return (
    <form
      {...getFormProps(form)}
      action={action}
      className={cn(
        "flex w-full flex-col gap-y-8",
        "**:data-[slot=input-container]:has-aria-invalid:[--hard-shadow-color:var(--color-red-800)] dark:**:data-[slot=input-container]:has-aria-invalid:[--hard-shadow-color:var(--color-destructive)]",
        "**:data-[slot=input]:focus-visible:outline-foreground",
        "dark:**:data-[slot=input]:aria-invalid:border-destructive **:data-[slot=input]:aria-invalid:border-red-800",
        "**:data-[slot=form-error]:text-red-900 dark:**:data-[slot=form-error]:text-red-200",
      )}
    >
      <FormInput
        label={t("form.fields.username.label")}
        placeholder={t("form.fields.username.placeholder")}
        type="text"
        field={fields.username}
        disabled={isPending || isDone}
      />

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending || isDone} variant="outline">
          {isPending || isDone
            ? t("auth.welcome.actions.continuePending")
            : t("auth.welcome.actions.continue")}
        </Button>

        {lastResult?.error?.[""] ? (
          <FormError
            id={form.errorId}
            errors={lastResult?.error?.[""] ?? []}
            className="my-0 h-fit text-right"
          />
        ) : null}
      </div>
    </form>
  );
};

export default WelcomeForm;
