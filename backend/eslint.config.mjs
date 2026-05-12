// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },

  eslint.configs.recommended,

  // نستخدم الـ recommended بدون type-checking عشان ما يطلعش unsafe any
  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      // نطفّي كل اللي كان بيطلّع unsafe any
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/await-thenable': 'off',

      // خلي unused vars warnings بس مش errors
      '@typescript-eslint/no-unused-vars': 'warn',

      // خلي floating promises warnings بس مش errors
      '@typescript-eslint/no-floating-promises': 'warn',

      // باقي اللي عايزينه
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-empty': 'off',
    },
  }
);
