module.exports = {
  purge: false,
  experimental: {
    applyComplexClasses: true,
  },
  theme: {
    extend: {},
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
