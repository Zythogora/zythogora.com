export const Theme = {
  light: 'light',
  dark: 'dark',
} as const;

export type ThemeValue = keyof typeof Theme;

export const themeKeyNameLS = 'theme';

export const setPageTheme = (theme: ThemeValue) => {
  if (theme === Theme.dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getTheme = () => {
  if (localStorage.getItem(themeKeyNameLS)) {
    return localStorage.getItem(themeKeyNameLS) as ThemeValue;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.dark;
  }

  return Theme.light;
};

export const persistTheme = (theme: ThemeValue) => {
  localStorage.setItem(themeKeyNameLS, theme);
};
