import classNames from 'classnames';
import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';
import { useTextField } from 'react-aria';
import { FieldValues, FormState, Path, UseFormRegister } from 'react-hook-form';

import { getFieldError, isFieldValid } from 'technical/form';
import BaseField from 'ui/form/baseField';

interface InputTextProps<Values extends FieldValues>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'defaultValue' | 'onBlur' | 'onChange' | 'onFocus' | 'onInput' | 'value'
  > {
  register: UseFormRegister<Values>;
  state: FormState<Values>;
  name: Path<Values>;
  label: ReactNode;
  description?: ReactNode;
}

const InputText = <Values extends FieldValues>({
  register,
  state,
  name,
  label,
  description,
  ...baseProps
}: InputTextProps<Values>) => {
  const isValid = isFieldValid(state, name);
  const errorMessage = getFieldError(state, name);

  const ref = useRef<HTMLInputElement>(null);

  const { inputProps, errorMessageProps } = useTextField(
    {
      ...baseProps,
      label,
      errorMessage,
      isRequired: baseProps.required,
    },
    ref,
  );

  const formProps = register(name, {
    onChange: inputProps.onChange,
    onBlur: inputProps.onBlur,
  });

  return (
    <BaseField
      errorMessage={errorMessage}
      errorMessageProps={errorMessageProps}
      required={baseProps.required}
    >
      <input
        className={classNames(
          baseProps.className,
          'w-full py-4 px-8 rounded-xl text-xl',
          'focus:outline-none focus:ring-1',
          isValid
            ? [
                'focus:border-blue-700',
                'focus:ring-blue-700',
                'dark:focus:border-blue-500',
                'dark:focus:ring-blue-500',
              ]
            : [
                '!border-red-700',
                'dark:!border-red-500',
                'focus:border-red-700',
                'focus:ring-red-700',
                'dark:focus:border-red-500',
                'dark:focus:ring-red-500',
              ],
        )}
        {...inputProps}
        {...formProps}
      />
      {/* <input
        className={classNames(
          'hover:bg-slate-200',
          'focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500',
          {
            ['border-pink-500 text-pink-600']: !isValid,
            ['focus:border-pink-500 focus:ring-pink-500']: !isValid,
          },
        )}
        ref={ref}
        {...inputProps}
      /> */}
    </BaseField>
  );
};

export default InputText;
