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
];

// Export all plugins our postcss should use
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/index.html',
        './src/index.jsx',
        './src/components/**/*.jsx',
      ],
      fontFace: false,
      safelist: cssWhitelistClassArray,
    }),
  ],
};
