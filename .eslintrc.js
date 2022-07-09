module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: 'babel-eslint',
  extends: ['plugin:react/recommended', 'airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    semi: [2, 'never'],
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'max-len': 'off',
    'react/prop-types': [1],
    'global-require': 'off',
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-newline': 'off',
    'no-unused-vars': 'warn',
    'operator-linebreak': 'off',
    'arrow-body-style': 'warn',
    'react/destructuring-assignment': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
}
