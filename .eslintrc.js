module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-prettier',
    'plugin:ava/recommended',
  ],
  plugins: ['eslint-plugin-prettier', 'eslint-plugin-ava'],
  env: {
    commonjs: true,
    node: true,
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
      },
    ],
  },
};
