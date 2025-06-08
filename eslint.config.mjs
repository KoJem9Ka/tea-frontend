// @ts-check

import {FlatCompat} from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import pluginImport from 'eslint-plugin-import';
import pluginImportNewlines from 'eslint-plugin-import-newlines';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginReact from 'eslint-plugin-react';
import { eslintBoundariesConfig } from "./eslint.boundaries.mjs";


const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});
// ...compat.config({
//   extends: ['next/core-web-vitals', 'next/typescript'],
// }),


export default tsEslint.config([{
  settings: {
    react: { version: '19.1.0' },
    'import/resolver': { typescript: {} },
  },
  extends: [
    pluginImport.flatConfigs.recommended,
    pluginImport.flatConfigs.typescript,
    ...pluginQuery.configs['flat/recommended'],
    eslintJs.configs.recommended,
    ...tsEslint.configs.strictTypeChecked,
  ],
  files: ['{src,scripts,__tests__}/**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2022,
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    'react-hooks': pluginReactHooks,
    'react-refresh': pluginReactRefresh,
    react: pluginReact,
    'import-newlines': pluginImportNewlines,
  },
  rules: {
    ...pluginReactHooks.configs.recommended.rules,
    ...pluginReact.configs.recommended.rules,
    ...pluginReact.configs['jsx-runtime'].rules,
    'react-refresh/only-export-components': ['off', { allowConstantExport: true }],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'jsx-quotes': ['error', 'prefer-single'],
    'indent': ['error', 2],
    '@typescript-eslint/consistent-type-imports': ['error', {
      fixStyle: 'inline-type-imports',
      disallowTypeAnnotations: false,
    }],
    'import/no-cycle': 'error',
    'import/order': ['error', {
      groups: [
        'builtin', // Built-in imports go first
        'external', // External imports
        'internal', // Absolute imports
        ['sibling', 'parent'], // Relative imports, the sibling and parent types they can be mingled together
        'index', // Index imports
        'unknown', // Unknown
      ],
      'newlines-between': 'never',
      alphabetize: {
        /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
        order: 'asc',
        /* ignore case. Options: [true, false] */
        caseInsensitive: true,
      },
    }],
    'import/newline-after-import': ['error', { count: 2 }],
    'import-newlines/enforce': 'error',
    // 'import/extensions': ['error', 'always', {
    //   ignorePackages: true,
    // }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    // 'import/no-unresolved': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
  },
}, eslintBoundariesConfig]);
