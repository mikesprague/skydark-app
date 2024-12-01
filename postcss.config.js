// import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';

const cssWhitelistClassArray = [
  /tippy/,
  /leaflet/,
  /leaflet-container/,
  /leaflet-controls-container/,
  /leaflet-control-layers/,
  /leaflet-control/,
  /pill/,
  /bubble/,
  /orange/,
  /red/,
  /yellow/,
  /green/,
  /purple/,
  /text-orange-(\d+)/,
  /text-blue-(\d+)/,
  /bg-blue-(\d+)/,
  /bg-purple-(\d+)/,
  /opacity-(\d+)/,
  /border-opacity-(\d+)/,
  /bg-gray-(\d+)/,
  /text-gray-(\d+)/,
  /bg-white/,
  /border-blue-(\d+)/,
  /border-gray-(\d+)/,
  /border-orange-(\d+)/,
  /border-black/,
  /border-b/,
  /swal2/,
  /aqi-(\w+)/,
];

// Export all plugins our postcss should use
export default {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
    'postcss-import': {},
    cssnano: {
      preset: 'default',
    },
    // purgeCSSPlugin: {
    //   content: [
    //     './src/index.html',
    //     './src/index.jsx',
    //     './src/components/**/*.jsx',
    //   ],
    //   fontFace: false,
    //   safelist: cssWhitelistClassArray,
    // },
  },
};
