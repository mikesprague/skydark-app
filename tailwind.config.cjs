/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './src/index.html',
    './src/index.jsx',
    './src/components/**/*.jsx',
    './src/modules/helpers.js',
  ],
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      gray: process.env['NODE_ENV'] === 'development' ? colors.slate : colors.zinc,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      transparent: colors.transparent,
    },
    extend: {
      inset: {
        15: '3.75rem',
      },
      spacing: {
        15: '3.75rem',
        xxs: '1.5px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
