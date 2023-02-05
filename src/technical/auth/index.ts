import {
  accessTokenKeyNameLS,
  AuthResponse,
  refreshTokenKeyNameLS,
} from 'technical/auth/types';

export const persistAuth = (data: AuthResponse) => {
  localStorage.setItem(accessTokenKeyNameLS, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(refreshTokenKeyNameLS, data.refresh_token);
  }
};

export const unpersistAuth = () => {
  localStorage.removeItem(accessTokenKeyNameLS);
  localStorage.removeItem(refreshTokenKeyNameLS);
};
