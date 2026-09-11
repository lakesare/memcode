import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'node_modules/**',
      'frontend/webpackedFiles/**',
      'backend/webpacked/**',
      'meresei/frontend/node_modules/**',
      'meresei/frontend/dist/**'
    ]
  },
  {
    files: ['frontend/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // injected as globals by frontend/esbuild-shims.js
        React: 'readonly',
        PropTypes: 'readonly',
        connect: 'readonly',
        Quill: 'readonly',
        process: 'readonly',
        // esbuild resolves require() of an asset into its emitted URL
        require: 'readonly'
      }
    },
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      // `false && <section>` is a deliberate way to park a JSX block here
      'no-constant-binary-expression': 'off',
      'no-prototype-builtins': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-children-prop': 'error'
    }
  },
  {
    files: ['backend/**/*.js', 'services/**/*.js', 'env*.js', '*.config.js', 'frontend/esbuild*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'no-prototype-builtins': 'off'
    }
  }
];
