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

  REVIEW_FORM: "/breweries/:brewerySlug/beers/:beerSlug/review",
} as const;

export type Path = (typeof Routes)[keyof typeof Routes];
