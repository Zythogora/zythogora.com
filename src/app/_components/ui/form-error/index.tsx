"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

interface FormErrorProps extends ComponentProps<"p"> {
  errors: string[] | undefined;
}

const FormError = ({ errors, className, ...restProps }: FormErrorProps) => {
  const t = useTranslations();

  if (!errors) {
    return null;
  }

  return (
    <p
      data-slot="form-error"
      className={cn(
        "text-destructive mt-1 -mb-1 flex h-0 flex-col pl-3 text-xs",
        className,
      )}
      {...restProps}
    >
      {
        // @ts-expect-error Typescript doesn't know that the error is a message key
        t(errors[0])
      }
    </p>
  );
};

export default FormError;
