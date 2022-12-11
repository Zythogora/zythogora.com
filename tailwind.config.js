/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
        'primary': "#ffb300",
      },
      backgroundImage: {
        'gradient-card': "radial-gradient(circle farthest-corner at 10% 20%, #00989b, #005e78)",
      },
    },
  },
  plugins: [],
};
