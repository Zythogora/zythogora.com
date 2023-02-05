import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { loginSchema } from 'business/account/pages/login/schema';
import { Login } from 'business/account/services';
import { LoginData } from 'business/account/types';
import { ApiError } from 'technical/api/types/error';
import CheckBox from 'ui/form/checkBox';
import FormError from 'ui/form/formError';
import InputText from 'ui/form/inputText';
import Layout from 'ui/layout';
import Spinner from 'ui/spinner';

const LoginPage = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState, reset } = useForm<LoginData>({
    defaultValues: {
      remember_me: true,
    },
    resolver: zodResolver(loginSchema),
  });

  const login = async (loginData: LoginData) => {
    try {
      await Login(loginData);
      navigate('/');
    } catch (error: any) {
      if (error instanceof ApiError) {
        setLoginError(error.message);
        reset({}, { keepValues: true });
      }
    }
  };

  return (
    <Layout title={'Zythogora - Login'}>
      <div
        className={classNames(
          'flex flex-col items-center p-12 font-bold',
          'text-gray-900',
          'dark:text-gray-200',
          'w-full',
          'md:w-128',
          'md:shadow md:rounded-xl',
          'md:bg-white',
          'md:dark:bg-gray-700',
        )}
      >
        <h1 className="mb-12 text-5xl">Login</h1>

        <form onSubmit={handleSubmit(login)} className="w-full">
          <div className="flex flex-col gap-y-6">
            <InputText
              className={classNames(
                'placeholder:text-gray-400',
                'bg-gray-50',
                'dark:bg-gray-700',
                'border-gray-700',
                'dark:border-gray-50',
                'md:bg-gray-100',
                'md:dark:bg-gray-600',
                'md:border-gray-600',
                'md:dark:border-gray-100',
              )}
              register={register}
              state={formState}
              name="username"
              placeholder="Username"
              label="Username"
              required
            />

            <InputText
              className={classNames(
                'placeholder:text-gray-400',
                'bg-gray-50',
                'dark:bg-gray-700',
                'border-gray-700',
                'dark:border-gray-50',
                'md:bg-gray-100',
                'md:dark:bg-gray-600',
                'md:border-gray-600',
                'md:dark:border-gray-100',
              )}
              register={register}
              state={formState}
              type="password"
              name="password"
              placeholder="Password"
              label="Password"
              required
            />
          </div>

          <div
            className={classNames(
              'flex self-start',
              'mt-4 gap-y-6 flex-col-reverse',
              'md:mt-12 md:flex-row md:items-center md:justify-between',
            )}
          >
            <CheckBox
              register={register}
              state={formState}
              defaultSelected={formState.defaultValues?.remember_me || false}
              name="remember_me"
            >
              Remember Me
            </CheckBox>

            <Link
              to="// !FIXME! //"
              className={classNames(
                'text-lg',
                'self-end',
                'md:self-auto',
                'text-gray-600',
                'dark:text-gray-300',
              )}
            >
              Password forgotten?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="mt-12 w-full py-4 px-8 rounded-xl flex justify-center text-2xl text-black bg-primary"
          >
            {formState.isSubmitting ? (
              <Spinner size="small" color="black" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        {loginError && !formState.isDirty ? (
          <div className="mt-3">
            <FormError error={loginError} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default LoginPage;
