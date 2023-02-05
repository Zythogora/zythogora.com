export type LoginData = {
  username: string;
  password: string;
  remember_me: boolean;
};

export type RefreshAccessTokenData = {
  user: string;
  refresh_token: string;
};
