export type AccessTokenData = {
  client_id: string;
  nickname: string;
  iat: number;
  exp: number;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string | null;
};

export const accessTokenKeyNameLS = 'access_token';
export const refreshTokenKeyNameLS = 'refresh_token';
