import classNames from 'classnames';

interface FormErrorProps {
  error: string;
}

const FormError = ({ error }: FormErrorProps) => {
  return (
    <p className={classNames('text-lg', 'text-red-600', 'dark:text-red-500')}>
      {error}
    </p>
  );
};

export default FormError;
