"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";

import { updateUsernameAction } from "@/app/[locale]/(business)/(with-header)/settings/actions";
import { updateUsernameSchema } from "@/app/[locale]/(business)/(with-header)/settings/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "@/lib/i18n";
import { cn } from "@/lib/tailwind";

interface UpdateUsernameFormProps {
  currentUsername: string;
}

const UpdateUsernameForm = ({ currentUsername }: UpdateUsernameFormProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { refetch } = authClient.useSession();

  const [lastResult, action] = useActionState(updateUsernameAction, undefined);
  const [isPending, startTransition] = useTransition();

  const handledResult = useRef<typeof lastResult>(undefined);

  useEffect(() => {
    if (
      lastResult?.status !== "success" ||
      handledResult.current === lastResult
    ) {
      return;
    }
    handledResult.current = lastResult;

    (async () => {
      await refetch();
      toast.success(t("settingsPage.username.success"));
      router.refresh();
    })();
  }, [lastResult, refetch, router, t]);

  const [form, fields] = useForm({
    lastResult,

    defaultValue: {
      username: currentUsername,
    },

    constraint: getZodConstraint(updateUsernameSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateUsernameSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();

      const submission = parseWithZod(formData, {
        schema: updateUsernameSchema,
      });

      if (
        submission.status === "success" &&
        submission.value.username === currentUsername
      ) {
        toast.info(t("settingsPage.username.unchanged"));
        return;
      }

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
      className={cn("flex w-full flex-col gap-y-6", "md:max-w-md")}
    >
      <FormInput
        label={t("form.fields.username.label")}
        placeholder={t("form.fields.username.placeholder")}
        type="text"
        field={fields.username}
        disabled={isPending}
      />

      <div className="flex flex-col gap-y-2">
        <Button type="submit" disabled={isPending} className="self-start">
          {isPending
            ? t("settingsPage.actions.savePending")
            : t("settingsPage.actions.save")}
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

export default UpdateUsernameForm;
