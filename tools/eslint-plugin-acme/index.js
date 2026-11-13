import noRawValues from './no-raw-values.js'

const plugin = {
  meta: { name: '@acme/eslint-plugin', version: '0.0.0' },
  rules: { 'no-raw-values': noRawValues },
}

/** Flat-config preset: `...acme.configs.recommended` in eslint.config.js. */
plugin.configs = {
  recommended: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: { acme: plugin },
      rules: { 'acme/no-raw-values': 'error' },
    },
  ],
}

export default plugin
