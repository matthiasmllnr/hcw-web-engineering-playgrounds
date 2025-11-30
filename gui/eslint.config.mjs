// eslint.config.mjs
import prettier from 'eslint-plugin-prettier';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '.angular/**'],
  },

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
