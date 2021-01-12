const cssWhitelistClassArray = [
  /tippy/,
  /leaflet/,
  /leaflet-container/,
  /leaflet-controls-container/,
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
  /ct-toast-info/,
];

// safelist purgecss plugin
const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: [
    './public/index.html',
    './src/components/**/*.js',
  ],

  // This is the function used to extract class names from your templates
  // defaultExtractor: (content) => {
  //   // Capture as liberally as possible, including things like `h-(screen-1.5)`
  //   const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
  //   // Capture classes within other delimiters like .block(class="w-1/2") in Pug
  //   const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
  //   return broadMatches.concat(innerMatches);
  // },
  fontFace: false,
  safelist: cssWhitelistClassArray,
});

// Export all plugins our postcss should use
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('cssnano')({
      preset: 'default',
    }),
    [purgecss],
    // ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
