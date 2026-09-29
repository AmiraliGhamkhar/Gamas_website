import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.ssg-temp/**',
      '.vite-react-ssg-temp/**',
      '**/*.min.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // `catch {}` is used deliberately throughout for fire-and-forget work
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]
