"use client";

import { useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";

import HidePasswordIcon from "@/app/_components/icons/hide-password";
import ShowPasswordIcon from "@/app/_components/icons/show-password";
import { cn } from "@/lib/tailwind";

interface InputProps extends ComponentProps<"input"> {
  containerClassName?: string;
}

const Input = ({
  className,
  containerClassName,
  type,
  ...restProps
}: InputProps) => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full origin-bottom antialiased transition-all duration-300 transform-3d",
        "before:bg-foreground before:absolute before:size-full before:translate-y-0.5 before:translate-z-[-1px] before:rounded before:object-center before:transition-all before:duration-300 before:transform-3d",
        "hover:w-[calc(100%+8px)] hover:-translate-x-1 hover:-translate-y-1 hover:before:translate-y-1.5 hover:before:translate-z-[-1px]",
        "has-focus-visible:w-[calc(100%+8px)] has-focus-visible:-translate-x-1 has-focus-visible:-translate-y-1 has-focus-visible:before:translate-y-1.5 has-focus-visible:before:translate-z-[-1px]",
        containerClassName,
      )}
    >
      <input
        type={type === "password" && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "peer bg-background relative w-full rounded border-2 py-4 text-sm antialiased ring-0 outline-none",
          type === "password" ? "pr-14 pl-5" : "px-5",
          "md:text-base",
          "placeholder:text-foreground-muted placeholder:select-none",
          "selection:bg-primary/25",
          "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
          "aria-invalid:border-destructive aria-invalid:before:bg-destructive",
          className,
        )}
        {...restProps}
      />

      {type === "password" ? (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          title={t(`form.fields.password.show.${showPassword}`)}
          aria-label={t("form.fields.password.show.ariaLabel")}
          aria-controls={restProps.id}
          aria-expanded={showPassword}
          className="absolute inset-y-[15px] right-[15px] size-7 p-1"
        >
          {showPassword ? (
            <HidePasswordIcon className="size-full" />
          ) : (
            <ShowPasswordIcon className="size-full" />
          )}
        </button>
      ) : null}
    </div>
  );
};

export default Input;
