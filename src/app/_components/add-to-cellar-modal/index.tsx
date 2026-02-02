"use client";

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { getZodConstraint } from "@conform-to/zod/v4";
import { ListPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { addToCellarAction } from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/actions";
import { addToCellarSchema } from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/schemas";
import PurchaseLocationAutocomplete from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/purchase-location-autocomplete";
import { useGoogleAutocompleteSession } from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/_components/purchase-location-autocomplete/hooks";
import FormCellarServingFormatSelector from "@/app/_components/form/cellar-serving-format-selector";
import FormDatePicker from "@/app/_components/form/date-picker";
import FormInput from "@/app/_components/form/input";
import FormStorageLocationSelector from "@/app/_components/form/storage-location-selector";
import QueryClientProvider from "@/app/_components/providers/query-client-provider";
import Button from "@/app/_components/ui/button";
import FormError from "@/app/_components/ui/form-error";
import Label from "@/app/_components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/app/_components/ui/responsive-dialog";
import { createStorageLocation } from "@/domain/storage-locations";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { usePathname } from "@/lib/i18n";

interface AddToCellarModalProps {
  beerId: string;
  beerName: string;
  storageLocations: StorageLocation[];
}

const AddToCellarModal = ({
  beerId,
  beerName,
  storageLocations,
}: AddToCellarModalProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState(storageLocations);

  const { getSessionToken } = useGoogleAutocompleteSession();

  const [lastResult, action] = useActionState(
    addToCellarAction.bind(null, pathname),
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [form, fields] = useForm({
    defaultValue: {
      beerId,
      quantity: "1",
      googlePlacesSessionToken: getSessionToken(),
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
    const newLocation = await createStorageLocation(name);
    setLocations((prev) =>
      [...prev, newLocation].sort((a, b) => a.name.localeCompare(b.name)),
    );
    return newLocation;
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <ListPlusIcon size={24} className="size-6" />

          <span className="sr-only">{t("cellar.addToCellar.title")}</span>
        </Button>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className="md:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {t("cellar.addToCellar.title")}
          </ResponsiveDialogTitle>
          <p className="text-foreground-muted text-sm">{beerName}</p>
        </ResponsiveDialogHeader>

        <QueryClientProvider>
          <FormProvider context={form.context}>
            <form
              {...getFormProps(form)}
              action={action}
              className="grid grid-cols-7 gap-x-4 gap-y-4"
            >
              <input
                {...getInputProps(fields.beerId, {
                  type: "hidden",
                  ariaAttributes: false,
                })}
                key={fields.beerId.key}
              />

              <input
                {...getInputProps(fields.googlePlacesSessionToken, {
                  type: "hidden",
                  ariaAttributes: false,
                })}
                key={fields.googlePlacesSessionToken.key}
              />

              <FormCellarServingFormatSelector
                field={fields.servingFormat}
                className="col-span-4"
              />

              <FormDatePicker
                label={t("cellar.form.bestBeforeDate.label")}
                field={fields.bestBeforeDate}
                className="col-span-3"
              />

              <FormStorageLocationSelector
                field={fields.storageLocationId}
                locations={locations}
                onCreateNew={handleCreateStorageLocation}
                className="col-span-4"
              />

              <FormInput
                label={t("cellar.form.quantity.label")}
                field={fields.quantity}
                type="number"
                className="col-span-3"
              />

              <div className="group/form-component col-span-3 flex w-full flex-col gap-y-1">
                <Label htmlFor={fields.purchaseLocationId.id}>
                  {t("cellar.form.purchaseLocation.label")}
                </Label>
                <PurchaseLocationAutocomplete
                  field={fields.purchaseLocationId}
                  getSessionToken={getSessionToken}
                />
              </div>

              <FormInput
                label={t("cellar.form.purchasePrice.label")}
                field={fields.purchasePrice}
                type="number"
                className="col-span-2"
              />

              <FormDatePicker
                label={t("cellar.form.purchaseDate.label")}
                field={fields.purchaseDate}
                className="col-span-2"
              />

              <div className="col-span-7 flex justify-end gap-x-2 pt-4">
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
        </QueryClientProvider>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default AddToCellarModal;
