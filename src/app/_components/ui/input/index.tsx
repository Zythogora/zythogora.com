"use client";

import { useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";

import HidePasswordIcon from "@/app/_components/icons/hide-password";
import ShowPasswordIcon from "@/app/_components/icons/show-password";
import { cn } from "@/lib/tailwind";

const Input = ({ className, type, ...restProps }: ComponentProps<"input">) => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      data-slot="input-container"
      className={cn(
        "group",
        "before:bg-foreground relative before:absolute before:inset-0 before:-bottom-0.5 before:z-[-1] before:rounded",
        "has-aria-invalid:before:bg-destructive",
        className,
      )}
    >
      <input
        data-slot="input"
        type={type === "password" && showPassword ? "text" : type}
        className={cn(
          "bg-background border-foreground flex w-full min-w-0 rounded border-2 px-5 py-4",
          "text-base md:text-sm",
          "dark:bg-stone-700",
          "placeholder:text-muted-foreground placeholder:select-none",
          "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
          "focus-visible:outline-primary focus-visible:outline-3",
          "aria-invalid:border-destructive",
          "aria-invalid:placeholder:text-destructive/50",
          "selection:bg-primary/25",
        )}
        {...restProps}
      />

      {type === "password" ? (
        <button
          data-slot="show-password-button"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          title={t(`form.fields.password.show.${showPassword}`)}
          aria-label={t("form.fields.password.show.ariaLabel")}
          aria-controls={restProps.id}
          aria-expanded={showPassword}
          className={cn(
            "fill-foreground absolute inset-y-[15px] right-[15px] size-7 rounded p-1",
            "focus-visible:outline-primary focus-visible:outline-3",
            "group-has-aria-invalid:fill-destructive",
          )}
        >
          {showPassword ? (
            <HidePasswordIcon size={28} className="size-full" />
          ) : (
            <ShowPasswordIcon size={28} className="size-full" />
          )}
        </button>
      ) : null}
    </div>
  );
};

export default Input;
