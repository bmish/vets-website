const eslintConfig = require('./.eslintrc');

// Add the config for preventing deprecated component-library imports
eslintConfig.plugins = [...eslintConfig.plugins, 'deprecate'];
eslintConfig.rules = {
  ...eslintConfig.rules,
  'deprecate/import': [
    'error',
    {
      name:
        '@department-of-veterans-affairs/component-library/CollapsiblePanel',
      use: '<va-accordion>',
    },
    {
      name: '@department-of-veterans-affairs/component-library/AlertBox',
      use: '<va-alert>',
    },
  ],
};

module.exports = eslintConfig;
