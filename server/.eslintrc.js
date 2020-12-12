module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base/legacy',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { 'code': 150 }],
    'object-curly-newline': ['error', { 'consistent': true }],
    'arrow-parens': [2, 'as-needed', { 'requireForBlockBody': true }],
    'no-plusplus': 'off',
    'import/extensions': 'off',
    'no-bitwise': 'off',
    'no-param-reassign': 'off',
    'radix': ['error', 'as-needed'],
    'no-eval': 'off',
  },
};
