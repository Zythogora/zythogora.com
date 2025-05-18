"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { editProfileAction } from "@/app/[locale]/(business)/(with-header)/users/[username]/edit/actions";
import { editProfileSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/edit/schemas";
import FormInput from "@/app/_components/form/input";
import Button from "@/app/_components/ui/button";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface EditProfileFormProps {
  username: string;
}

const EditProfileForm = ({ username }: EditProfileFormProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [lastResult, action] = useActionState(
    editProfileAction.bind(null, username),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [newUsername, setNewUsername] = useState(username);

  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      username: username,
    },

    constraint: getZodConstraint(editProfileSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editProfileSchema });
    },

    onSubmit(event, { formData }) {
      event.preventDefault();

      const data = parseWithZod(formData, { schema: editProfileSchema });
      if (data.status !== "success") {
        return;
      }

      if (data.value.username === username) {
        toast.success(t("editProfilePage.toasts.nothingToDo"));
        return;
      }

      setNewUsername(data.value.username ?? username);

      startTransition(() => {
        action(formData);
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (lastResult) {
      if (lastResult.status === "success") {
        toast.success(t("editProfilePage.toasts.success"));

        router.push(generatePath(Routes.PROFILE, { username: newUsername }));
      } else {
        if (lastResult.error?.[""]?.[0]?.endsWith("NOTHING_TO_UPDATE")) {
          toast.success(t("editProfilePage.toasts.nothingToDo"));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  const handleCancel = () => {
    startTransition(() => {
      router.back();
    });
  };

  return (
    <form
      {...getFormProps(form)}
      className="@container flex w-full flex-col gap-y-8"
    >
      <FormInput
        label={t("form.fields.username.label")}
        placeholder={t("form.fields.username.placeholder")}
        type="text"
        field={fields.username}
        disabled={isPending}
      />

      <div className="flex flex-col gap-y-2">
        <div className="grid w-full grid-cols-3 gap-4">
          <Button
            type="reset"
            onClick={handleCancel}
            variant="outline"
            disabled={isPending}
            className="col-span-3 row-start-2 @md:col-span-1 @md:row-start-auto"
          >
            {t("editProfilePage.actions.cancel")}
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="col-span-3 @md:col-span-2"
          >
            {isPending
              ? t("editProfilePage.actions.updating")
              : t("editProfilePage.actions.update")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditProfileForm;
