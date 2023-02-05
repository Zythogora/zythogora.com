import classNames from 'classnames';
import { InputHTMLAttributes, ReactNode, useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { FieldValues, FormState, Path, UseFormRegister } from 'react-hook-form';
import { useToggleState } from 'react-stately';

interface CheckBoxProps<Values extends FieldValues>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement> & { defaultSelected: boolean },
    'onBlur' | 'onChange' | 'onFocus' | 'value'
  > {
  register: UseFormRegister<Values>;
  state: FormState<Values>;
  name: Path<Values>;
}

const CheckBox = <Values extends FieldValues>({
  register,
  state,
  name,
  ...baseProps
}: CheckBoxProps<Values>) => {
  const ariaRef = useRef<HTMLInputElement | null>(null);

  const checkBoxState = useToggleState(baseProps);
  const { inputProps } = useCheckbox(baseProps, checkBoxState, ariaRef);

  const formProps = register(name, {
    onChange: inputProps.onChange,
    onBlur: inputProps.onBlur,
  });

  return (
    <label className="flex items-center flex-row gap-x-2">
      <input
        className={classNames(
          'w-6 h-6 rounded-lg',
          'focus:outline-none focus:ring-1',
          'bg-gray-100 border-gray-600 text-gray-600',
          'dark:bg-gray-600 dark:border-gray-100 dark:text-gray-500',
        )}
        {...inputProps}
        {...formProps}
      />

      <span
        className={classNames('text-lg', 'text-gray-600', 'dark:text-gray-300')}
      >
        {baseProps.children}
      </span>
    </label>
  );
};

export default CheckBox;
