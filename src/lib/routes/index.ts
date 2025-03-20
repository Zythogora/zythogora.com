export const Routes = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  SIGN_UP_VERIFICATION: "/sign-up/email-verification",
  PASSWORD_FORGOTTEN: "/password-forgotten",
  RESET_PASSWORD: "/reset-password",

  HOME: "/",

  SEARCH: "/search",

  BREWERY: "/breweries/:brewerySlug",

  BEER: "/breweries/:brewerySlug/beers/:beerSlug",

  PROFILE: "/users/:username",
  REVIEW: "/users/:username/reviews/:reviewSlug",

  REVIEW_FORM: "/breweries/:brewerySlug/beers/:beerSlug/review",

  CREATE_BEER: "/create/beer",
  CREATE_BREWERY: "/create/brewery",

  ACCEPT_FRIEND_REQUEST: "/friend-requests/accept",
  DENY_FRIEND_REQUEST: "/friend-requests/deny",
} as const;

export type Path = (typeof Routes)[keyof typeof Routes];
