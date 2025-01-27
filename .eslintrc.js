module.exports = {
  // All rules should be disabled or they should produce errors. No warnings.
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {}, // need to add this
      'babel-module': {},
    },
  },
  plugins: [
    'cypress',
    'deprecate',
    'fp',
    'mocha',
    'react-hooks',
    'sonarjs',
    'unicorn',
    'va',
  ],
  extends: [
    'airbnb',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    commonjs: true,
    'cypress/globals': true,
    es2020: true,
    mocha: true,
  },
  globals: {
    __BUILDTYPE__: true,
    __API__: true,
    __MEGAMENU_CONFIG__: true,
  },
  rules: {
    /* || Eslint main rules || */
    camelcase: [2, { properties: 'always' }], // Override airbnb style.
    'deprecate/import': [
      'warn',
      {
        name:
          '@department-of-veterans-affairs/component-library/CollapsiblePanel',
        use: '<va-accordion>',
      },
      {
        name: '@department-of-veterans-affairs/component-library/AlertBox',
        use: '<va-alert>',
      },
      {
        name:
          '@department-of-veterans-affairs/component-library/LoadingIndicator',
        use: '<va-loading-indicator>',
      },
    ],

    // "func-names": 2,
    'no-console': 2,
    'no-unused-vars': [
      2,
      { args: 'after-used', argsIgnorePattern: '^_', vars: 'local' },
    ],
    'no-restricted-imports': ['error', 'raven', 'lodash/fp'],
    'prefer-rest-params': 2,

    /* || va custom plugin || */
    'va/proptypes-camel-cased': 2,
    'va/enzyme-unmount': 2,
    'va/use-resolved-path': [
      2,
      {
        aliases: ['applications', 'platform', 'site', '@@vap-svc', '@@profile'],
      },
    ],
    'va/correct-apostrophe': 1,

    /* || fp plugin || */
    'fp/no-proxy': 2, // IE 11 has no polyfill for Proxy

    /* || mocha plugin || */
    'mocha/no-exclusive-tests': 2,

    /* || react-hooks plugin || */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /* || react plugin || */
    'react/no-multi-comp': 0, // Leave organization to code reviewer discretion.
    'react/prefer-stateless-function': 2,
    'react/jsx-key': 2,
    'react/jsx-pascal-case': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-target-blank': 2,
    'react/no-danger': 2,
    'react/no-deprecated': 2,
    'react/no-direct-mutation-state': 2,

    /* || sonarJS plugin || */
    'sonarjs/no-all-duplicated-branches': 2,
    'sonarjs/no-element-overwrite': 2,
    'sonarjs/no-identical-conditions': 2,
    'sonarjs/no-one-iteration-loop': 2,
    'sonarjs/no-use-of-empty-return-value': 2,
    'sonarjs/no-collection-size-mischeck': 2,
    'sonarjs/no-redundant-jump': 2,
    'sonarjs/no-same-line-conditional': 2,
    'sonarjs/no-useless-catch': 2,
    'sonarjs/prefer-object-literal': 2,
    'sonarjs/prefer-single-boolean-return': 2,
    'sonarjs/prefer-while': 2,
    'sonarjs/no-extra-arguments': 2,
    'sonarjs/no-identical-expressions': 2,
    'sonarjs/max-switch-cases': [2, 40],
    'sonarjs/no-duplicated-branches': 2,
    'sonarjs/no-inverted-boolean-check': 2,
    'sonarjs/no-redundant-boolean': 2,
    'sonarjs/no-unused-collection': 2,
    'sonarjs/no-small-switch': 2,
    'sonarjs/cognitive-complexity': [1, 50],
    'sonarjs/no-collapsible-if': 2,
    'sonarjs/prefer-immediate-return': 2,

    /* || airbnb plugin || */
    // this is the airbnb default, minus for..of
    'no-restricted-syntax': [
      2,
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    /* || Unicorn plugin || */
    'unicorn/no-abusive-eslint-disable': 2,

    /* ----- TODO: evaluate and potentially turn these rules back on ----- */

    /* TODO | DISABLED TEMPORARILY */
    'max-classes-per-file': 0, // 1
    'no-buffer-constructor': 0, // 13
    'prefer-promise-reject-errors': 0, // 14
    'func-names': 0, // 14
    'no-restricted-globals': 0, // 28
    'no-else-return': 0, // 41 (fixable)
    'prefer-object-spread': 0, // 78 (fixable)
    'lines-between-class-members': 0, // 103 (fixable)
    'prefer-destructuring': 0, // 261 (fixable)

    'react/jsx-fragments': 0, // 2 (fixable)
    'react/jsx-closing-tag-location': 0, // 3 (fixable)
    'react/no-typos': 0, // 5
    'react/state-in-constructor': 0, // 7
    'react/no-unused-state': 0, // 15
    'react/sort-comp': 0, // 23
    'react/default-props-match-prop-types': 0, // 44
    'react/static-property-placement': 0, // 50
    'react/jsx-wrap-multilines': 0, // 60 (fixable)
    'react/jsx-curly-brace-presence': 0, // 71 (fixable)
    'react/no-access-state-in-setstate': 0, // 79
    'react/jsx-curly-newline': 0, // 95 (fixable)
    'react/button-has-type': 0, // 196
    'react/jsx-props-no-spreading': 0, // 767
    'react/jsx-one-expression-per-line': 0, // 2188 (fixable)
    'react/destructuring-assignment': 0, // 3010

    'jsx-a11y/control-has-associated-label': 0, // 7
    'jsx-a11y/click-events-have-key-events': 0, // 10
    'jsx-a11y/anchor-is-valid': 0, // 19
    'jsx-a11y/label-has-associated-control': 0, // 35
    'jsx-a11y/label-has-for': 0, // 66

    'import/named': 0, // 2
    'import/no-useless-path-segments': 0, // 59  (fixable)
    'import/no-cycle': 0, // 105
    'import/order': 0, // 544 (fixable)

    /* || Eslint main rules || */
    'no-plusplus': 0,
    'no-negated-condition': 0, // Sometimes negated conditions are easier to understand.
    'no-underscore-dangle': 0, // We have build flags that use this
    'class-methods-use-this': 0,
    'global-require': 0,
    'lines-around-directive': 0,
    'no-mixed-operators': 0,
    'no-undef-init': 0,
    'padded-blocks': 0,

    /* || import plugin || */
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'import/first': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,

    /* || jsx-a11y plugin || */
    'jsx-a11y/href-no-hash': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    /* || react plugin || */
    'react/no-string-refs': 0, // TODO(awong): Enable.
    'react/prop-types': 0, // TODO(awong): Enable.
    'react/sort-prop-types': [0, { callbacksLast: true, requiredFirst: true }], // TODO(awong): Too hard to turn on.
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-indent-props': 0,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': [0, { ignoreRefs: true }], // TODO: Enable after fixing.
    'react/jsx-sort-props': [0, { callbacksLast: true, shorthandFirst: true }], // TODO(awong): Too hard to turn on.
    'react/no-array-index-key': 0,
    'react/no-unescaped-entities': 0,
    'react/no-unused-prop-types': 0,
    'react/require-default-props': 0,
  },
  overrides: [
    {
      files: [
        'src/platform/**/*.js',
        'src/platform/**/*.jsx',
        'src/applications/site-wide/**/*.js',
        'src/applications/site-wide/**/*.jsx',
        'src/applications/static-pages/**/*.js',
        'src/applications/static-pages/**/*.jsx',
      ],
      rules: {
        'no-restricted-imports': ['error', 'raven', 'lodash/fp'],
      },
    },
    {
      files: [
        '**/*.spec.jsx',
        '**/*.spec.js',
        'src/platform/testing/**/*.js',
        'src/platform/testing/**/*.jsx',
      ],
      rules: {
        'no-restricted-imports': ['error', 'raven'],
        'no-unused-expressions': 0,
        'react/no-find-dom-node': 0,
      },
    },
    {
      files: ['**/*.e2e.spec.js'],
      rules: {
        'va/axe-check-required': 1,
      },
    },
  ],
};
