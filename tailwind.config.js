/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'sans': ['neuzeit-grotesk', ...defaultTheme.fontFamily.sans],
   },
    extend: {
      spacing: {
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      },
      colors: {
        'primary': {
          50: 'hsl(42,100%,95%)',
          100: 'hsl(42,100%,90%)',
          200: 'hsl(42,100%,80%)',
          300: 'hsl(42,100%,70%)',
          400: 'hsl(42,100%,60%)',
          500: 'hsl(42,100%,50%)', // default
          600: 'hsl(42,95%,42.5%)',
          700: 'hsl(42,90%,35%)',
          800: 'hsl(42,85%,27.5%)',
          900: 'hsl(42,80%,20%)',
        }
      },
      backgroundImage: {
        'gradient-card': "radial-gradient(circle farthest-corner at 10% 20%, hsl(181,100%,31%), hsl(193,100%,24%))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

config.theme.extend.colors.primary["DEFAULT"] = config.theme.extend.colors.primary["500"];

module.exports = config;