"use client";

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { getZodConstraint } from "@conform-to/zod/v4";
import { PackagePlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

import FormCellarServingFormatSelector from "@/app/_components/form/cellar-serving-format-selector";
import FormDatePicker from "@/app/_components/form/date-picker";
import FormInput from "@/app/_components/form/input";
import FormStorageLocationSelector from "@/app/_components/form/storage-location-selector";
import Button from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import FormError from "@/app/_components/ui/form-error";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { usePathname } from "@/lib/i18n";
import { cn } from "@/lib/tailwind";

import type { SubmissionResult } from "@conform-to/react";

// We need to import the schema from the cellar schemas
import { addToCellarSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/schemas";

interface AddToCellarModalProps {
  beerId: string;
  beerName: string;
  storageLocations: StorageLocation[];
  addToCellarAction: (
    pathname: string,
    previousState: unknown,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]> | undefined>;
  createStorageLocationAction: (name: string) => Promise<StorageLocation>;
}

const AddToCellarModal = ({
  beerId,
  beerName,
  storageLocations,
  addToCellarAction,
  createStorageLocationAction,
}: AddToCellarModalProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState(storageLocations);

  const [lastResult, action] = useActionState(
    addToCellarAction.bind(null, pathname),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    defaultValue: {
      beerId,
      quantity: "1",
      servingFormat: undefined,
      bestBeforeDate: undefined,
      purchaseDate: undefined,
      purchasePrice: undefined,
      storageLocationId: undefined,
    },

    lastResult,

    constraint: getZodConstraint(addToCellarSchema),

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addToCellarSchema });
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

  useEffect(() => {
    if (lastResult?.status === "success") {
      setOpen(false);
      toast.success(t("cellar.addToCellar.success", { beerName }));
    }
  }, [lastResult, beerName, t]);

  useEffect(() => {
    if (lastResult?.error && lastResult.status === "error") {
      const errorKey = Object.values(lastResult.error)[0]?.[0];
      if (errorKey) {
        toast.error(t(errorKey));
      }
    }
  }, [lastResult, t]);

  const handleCreateStorageLocation = async (name: string) => {
    const newLocation = await createStorageLocationAction(name);
    setLocations((prev) => [...prev, newLocation].sort((a, b) =>
      a.name.localeCompare(b.name)
    ));
    return newLocation;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "shrink-0",
            "md:rounded-t-md md:rounded-br-[14px] md:before:rounded-t md:before:rounded-br-xl",
          )}
        >
          <PackagePlusIcon size={20} />
          <span className="sr-only">{t("cellar.addToCellar.title")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("cellar.addToCellar.title")}</DialogTitle>
          <p className="text-sm text-foreground-muted">{beerName}</p>
        </DialogHeader>

        <FormProvider context={form.context}>
          <form
            {...getFormProps(form)}
            action={action}
            className="flex flex-col gap-y-4"
          >
            <input
              {...getInputProps(fields.beerId, {
                type: "hidden",
                ariaAttributes: false,
              })}
              key={fields.beerId.key}
            />

            <FormInput
              label={t("cellar.form.quantity.label")}
              field={fields.quantity}
              type="number"
            />

            <FormCellarServingFormatSelector field={fields.servingFormat} />

            <FormDatePicker
              label={t("cellar.form.bestBeforeDate.label")}
              field={fields.bestBeforeDate}
            />

            <FormDatePicker
              label={t("cellar.form.purchaseDate.label")}
              field={fields.purchaseDate}
            />

            <FormInput
              label={t("cellar.form.purchasePrice.label")}
              field={fields.purchasePrice}
              type="number"
            />

            <FormStorageLocationSelector
              field={fields.storageLocationId}
              locations={locations}
              onCreateNew={handleCreateStorageLocation}
            />

            <div className="flex justify-end gap-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("common.close")}
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t("cellar.addToCellar.submitting")
                  : t("cellar.addToCellar.submit")}
              </Button>
            </div>

            {lastResult?.error?.[""] ? (
              <FormError
                id={form.errorId}
                errors={lastResult?.error?.[""] ?? []}
              />
            ) : null}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCellarModal;
