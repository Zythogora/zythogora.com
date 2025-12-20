import { useField } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CreateBreweryData } from "@/app/[locale]/(business)/(without-header)/create/brewery/schemas";
import FormError from "@/app/_components/ui/form-error";
import Input from "@/app/_components/ui/input";
import { cn } from "@/lib/tailwind";

export const emptySocialLinkValue = {
  name: "",
  url: "",
};

interface SocialLinkProps {
  index: number;
  socialLink: CreateBreweryData["socialLinks"][number];
  onChange: (
    index: number,
    field: keyof CreateBreweryData["socialLinks"][number],
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}

const SocialLink = ({
  index,
  socialLink,
  onChange,
  onRemove,
}: SocialLinkProps) => {
  const t = useTranslations();

  const [nameField] = useField(`socialLinks[${index}].name`);
  const [urlField] = useField(`socialLinks[${index}].url`);

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid w-full grid-cols-[auto_max-content] rounded-[7px] *:m-[-1px]",
          "focus-within:outline-3 focus-within:outline-offset-1",
          "focus-within:outline-primary-700 dark:focus-within:outline-primary-100",
          "before:bg-foreground relative before:absolute before:inset-[-1px] before:bottom-[-3px] before:z-[-1] before:rounded",
          "**:data-[slot=input-container]:rounded-none **:data-[slot=input-container]:focus-within:z-50",
          "**:data-[slot=input]:rounded-none",
        )}
      >
        <Input
          {...getInputProps(nameField, {
            type: "text",
            ariaAttributes: true,
          })}
          key={nameField.key}
          type="text"
          value={socialLink.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          aria-label={t("createBreweryPage.fields.socialLinks.name.label")}
          placeholder={t(
            "createBreweryPage.fields.socialLinks.name.placeholder",
          )}
          className={cn(
            "col-start-1 row-start-1 rounded-tl",
            "before:bottom-0",
            "*:data-[slot=input]:rounded-tl!",
          )}
        />

        <Input
          {...getInputProps(urlField, {
            type: "text",
            ariaAttributes: true,
          })}
          key={urlField.key}
          type="text"
          value={socialLink.url}
          onChange={(e) => onChange(index, "url", e.target.value)}
          aria-label={t("createBreweryPage.fields.socialLinks.url.label")}
          placeholder={t(
            "createBreweryPage.fields.socialLinks.url.placeholder",
          )}
          className={cn(
            "col-start-1 row-start-2 rounded-bl",
            "before:rounded-none before:rounded-bl",
            "*:data-[slot=input]:rounded-bl!",
          )}
        />

        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={t("createBreweryPage.fields.socialLinks.actions.remove")}
          title={t("createBreweryPage.fields.socialLinks.actions.remove")}
          className={cn(
            "border-foreground col-start-2 row-span-2 row-start-1 cursor-pointer rounded-r border-2 px-3",
            "bg-stone-300 dark:bg-stone-500",
            "focus-visible:z-50",
          )}
        >
          <XIcon className="size-6" />
        </button>
      </div>

      {nameField.errors ? (
        <FormError id={nameField.errorId} errors={nameField.errors} />
      ) : (
        <FormError id={urlField.errorId} errors={urlField.errors} />
      )}
    </div>
  );
};

export default SocialLink;
