export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-deprecated': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'theme',
          'plugin',
          'utility',
        ],
      },
    ],
    'no-descending-specificity': null,
    'no-empty-source': null,
  },
};
