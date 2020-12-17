const colors = require('tailwindcss/colors');
const cssWhitelistClassArray = [
  'tippy',
  'leaflet',
  'leaflet-container',
  'leaflet-controls-container',
  'pill',
  'orange',
  'red',
  'yellow',
  'green',
  'purple',
  'bg-blue-400',
  'bg-blue-500',
  'bg-blue-600',
  'bg-purple-400',
  'bg-purple-500',
  'bg-purple-600',
  'opacity-75',
  'bg-gray-50',
  'bg-gray-100',
  'bg-gray-200',
  'bg-gray-300',
  'bg-gray-400',
  'bg-gray-500',
  'bg-gray-600',
  'bg-gray-700',
  'bg-gray-800',
  'bg-gray-900',
  'dark:bg-gray-50',
  'dark:bg-gray-100',
  'dark:bg-gray-200',
  'dark:bg-gray-300',
  'dark:bg-gray-400',
  'dark:bg-gray-500',
  'dark:bg-gray-600',
  'dark:bg-gray-700',
  'dark:bg-gray-800',
  'dark:bg-gray-900',
  'bg-white',
  'ct-toast-info',
];

module.exports = {
  darkMode: 'class',
  purge: {
    content: [
      './public/index.html',
      './src/components/**/*.js',
      './src/modules/helpers.js',
    ],
    preserveHtmlElements: false,
    options: {
      safeList: cssWhitelistClassArray,
      defaultExtractor: (content) => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
      },
    },
  },
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
