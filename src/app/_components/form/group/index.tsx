import { cn } from "@/lib/tailwind";

import type { PropsWithChildren } from "react";

interface FormGroupProps {
  formId: string;
  label: string;
  className?: string;
}

const FormGroup = ({
  formId,
  label,
  children,
  className,
}: PropsWithChildren<FormGroupProps>) => {
  // The proper way to do this would be to use the fieldset and legend elements
  // but there is a bug in some browsers that makes them not work properly
  // with flex containers.
  return (
    <div
      aria-labelledby={`${formId}-group-${label}`}
      className="flex w-full flex-col gap-y-3"
    >
      <h2 id={`${formId}-group-${label}`} className="text-xl">
        {label}
      </h2>

      <div className={cn("flex w-full flex-col gap-y-8", className)}>
        {children}
      </div>
    </div>
  );
};

export default FormGroup;
