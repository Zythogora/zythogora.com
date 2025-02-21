export const Routes = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  SIGN_UP_VERIFICATION: "/sign-up/email-verification",

  HOME: "/",

  SEARCH: "/search",

  BREWERY: "/breweries/:brewerySlug",

  BEER: "/breweries/:brewerySlug/beers/:beerSlug",
} as const;

export type Path = (typeof Routes)[keyof typeof Routes];
