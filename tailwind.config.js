/** @type {import('tailwindcss').Config} */
import * as typography from '@tailwindcss/typography';
import * as colors from 'tailwindcss/colors';

export default {
  mode: 'jit',
  darkMode: 'media',
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
      gray: process.env.NODE_ENV === 'development' ? colors.slate : colors.zinc,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      lime: colors.lime,
      fuchsia: colors.fuchsia,
      rose: colors.rose,
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
  plugins: [typography],
};
