import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';

import {
  AccessTokenData,
  accessTokenKeyNameLS,
  refreshTokenKeyNameLS,
} from 'technical/auth/types';

import { RefreshAccessToken } from './../../business/account/services/index';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem(accessTokenKeyNameLS);

  if (!accessToken) {
    return config;
  }

  if (!config.headers) {
    config.headers = {};
  }

  config.headers.Authorization = accessToken;

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    console.log(error);
    const config = error.config;
    if (error.response) {
      if (
        error.response.data.detail.error === 'AUTH_EXPIRED_ACCESS_TOKEN' &&
        !config._retry
      ) {
        const accessToken = localStorage.getItem(accessTokenKeyNameLS);
        const refreshToken = localStorage.getItem(refreshTokenKeyNameLS);

        if (!accessToken || !refreshToken) {
          return Promise.reject(error);
        }

        config._retry = true;

        await RefreshAccessToken({
          user: jwt_decode<AccessTokenData>(accessToken).client_id,
          refresh_token: refreshToken,
        });

        return api(config);
      }
    }

    return Promise.reject(error);
  },
);

export { api };
