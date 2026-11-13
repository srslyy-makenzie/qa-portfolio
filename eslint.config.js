import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// mak UI's design-system lint rule (vendored by `pnpm sync:ds`): semantic tokens only.
import acme from './tools/eslint-plugin-acme/index.js'

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'next-env.d.ts',
      'tools/**',
      'src/styles/mak-ui/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{jsx,tsx}'], ...jsxA11y.flatConfigs.strict },
  reactHooks.configs.flat['recommended-latest'] ?? reactHooks.configs['recommended-latest'],
  {
    plugins: { '@next/next': nextPlugin },
    rules: { ...nextPlugin.configs.recommended.rules, ...nextPlugin.configs['core-web-vitals'].rules },
  },
  // Playwright fixtures call `use()`, which is not React's hook.
  { files: ['tests/e2e/**'], rules: { 'react-hooks/rules-of-hooks': 'off' } },
  ...acme.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
)
