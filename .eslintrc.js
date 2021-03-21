module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'prettier',
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    indent: [2, 2],
    'prettier/prettier': 'error',
    'require-jsdoc': 'warn',
    quotes: [2, 'single'],
    semi: ['error', 'always'],
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
  },
};
