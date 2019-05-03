/* eslint-disable import/no-extraneous-dependencies */
const {
  rules: airbnbBaseStyle,
} = require('eslint-config-airbnb-base/rules/style');
const {
  rules: airbnbBaseBestPractices,
} = require('eslint-config-airbnb-base/rules/best-practices');

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
    'prettier/babel',
    'plugin:ava/recommended',
  ],
  plugins: ['eslint-plugin-babel', 'eslint-plugin-ava'],
  parser: 'babel-eslint',
  env: {
    es6: true,
    commonjs: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // Disable rules for which there are eslint-plugin-babel replacements:
    // https://github.com/babel/eslint-plugin-babel#rules
    'new-cap': 'off',
    'no-invalid-this': 'off',
    'object-curly-spacing': 'off',
    semi: 'off',
    'no-unused-expressions': 'off',
    // Ensure the replacement rules use the options set by airbnb rather than ESLint defaults.
    'babel/new-cap': airbnbBaseStyle['new-cap'],
    'babel/no-invalid-this': airbnbBaseBestPractices['no-invalid-this'],
    'babel/object-curly-spacing': airbnbBaseStyle['object-curly-spacing'],
    'babel/semi': airbnbBaseStyle.semi,
    'babel/no-unused-expressions':
      airbnbBaseBestPractices['no-unused-expressions'],
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        jsxBracketSameLine: true,
        trailingComma: 'all',
        proseWrap: 'always',
        endOfLine: 'lf',
      },
    ],
  },
};
