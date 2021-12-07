'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'eslint-plugin/require-meta-docs-url': [
      'error',
      {
        pattern:
          'https://github.com/department-of-veterans-affairs/vets-website/tree/master/script/eslint-plugin-va/docs/rules/{{name}}.md',
      },
    ],
  },
};
