"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import HidePasswordIcon from "@/app/_components/icons/hide-password";
import ShowPasswordIcon from "@/app/_components/icons/show-password";
import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Input = ({ className, type, ...restProps }: ComponentProps<"input">) => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      data-slot="input-container"
      className={cn(
        "group/input",
        "before:bg-foreground relative before:absolute before:inset-0 before:-bottom-0.5 before:z-[-1] before:rounded",
        "has-aria-invalid:before:bg-destructive",
        className,
      )}
    >
      <input
        {...restProps}
        data-slot="input"
        type={type === "password" && showPassword ? "text" : type}
        className={cn(
          "bg-background border-foreground flex w-full min-w-0 rounded border-2 px-5 py-4",
          "dark:bg-stone-700",
          "placeholder:text-foreground-muted placeholder:select-none",
          "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
          "aria-invalid:border-destructive",
          "aria-invalid:placeholder:text-destructive/50",
        )}
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
            "group-has-aria-invalid/input:fill-destructive",
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
