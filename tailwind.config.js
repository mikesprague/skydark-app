const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./public/index.html', './src/components/**/*.js', './src/modules/helpers.js'],
  theme: {
    colors: {
      white: '#fff',
      black: '#000',
      gray: colors.gray,
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
