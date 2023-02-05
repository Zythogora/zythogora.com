import { FocusableElement } from '@react-types/shared';
import classNames from 'classnames';
import { DOMAttributes, LabelHTMLAttributes, ReactNode } from 'react';

import FormError from 'ui/form/formError';

interface BaseFieldProps {
  children: ReactNode;
  label?: ReactNode;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  description?: ReactNode;
  descriptionProps?: DOMAttributes<FocusableElement>;
  errorMessage?: string;
  errorMessageProps?: DOMAttributes<FocusableElement>;
  required?: boolean;
}

const BaseField = ({
  children,
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  errorMessageProps,
  required = false,
}: BaseFieldProps) => {
  return (
    <div>
      {label ? (
        <label className="flex flex-row gap-x-1 font-medium" {...labelProps}>
          {label}
          {required ? (
            <span className={classNames('text-red-600', 'dark:text-red-500')}>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {errorMessage ? (
        <div className="mt-3" {...errorMessageProps}>
          <FormError error={errorMessage} />
        </div>
      ) : null}

      {description ? (
        <div className="mt-3" {...descriptionProps}>
          {description}
        </div>
      ) : null}
    </div>
  );
};

export default BaseField;
