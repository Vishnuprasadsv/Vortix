import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Export ESLint configuration for code linting
export default defineConfig([
  // Ignore the build output directory
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'], // Apply rules to JavaScript and JSX files
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020, // Support modern JavaScript features
      globals: globals.browser, // Define browser globals like 'window'
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused variables if they start with a capital letter or underscore
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
