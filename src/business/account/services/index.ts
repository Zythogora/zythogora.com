import { AxiosError } from 'axios';

import { LoginData, RefreshAccessTokenData } from 'business/account/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';
import { persistAuth } from 'technical/auth';
import { AuthResponse } from 'technical/auth/types';

export const Login = async (loginData: LoginData) => {
  try {
    const response = await api.post<AuthResponse>('/account/login', loginData);

    persistAuth(response.data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        throw new ApiError(
          401,
          'That username / password does not seem to be correct.',
        );
      } else {
        throw new ApiError(
          error.response.status,
          'Something went wrong on our side while fetching trying to log you in.',
        );
      }
    }
    throw error;
  }
};

export const RefreshAccessToken = async (
  refreshAccessTokenData: RefreshAccessTokenData,
) => {
  try {
    const response = await api.post<AuthResponse>(
      '/account/refreshAccessToken',
      refreshAccessTokenData,
    );

    persistAuth(response.data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        throw new ApiError(401, 'That session does not seem to be correct.');
      } else if (error.response.status === 403) {
        throw new ApiError(403, 'Your session has expired.');
      } else {
        throw new ApiError(
          error.response.status,
          'Something went wrong on our side while trying to refresh your access token.',
        );
      }
    }
    throw error;
  }
};
