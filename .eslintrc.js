module.exports = {
  root: true,
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  // Force dotfiles to be checked, since by default ESLint ignores them.
  ignorePatterns: ['!.*.js'],
  reportUnusedDisableDirectives: true,
  rules: {
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
  },
};
