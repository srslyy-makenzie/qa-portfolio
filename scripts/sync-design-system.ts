// Copies mak UI's token CSS, Tailwind theme and lint rule from a local acme-ds checkout.
// The @acme scope is a placeholder and isn't published to npm yet, so the site vendors these
// files (committed) instead of depending on the packages. Components come from the shadcn
// registry (components.json). Usage: pnpm sync:ds [path-to-acme-ds]
import { cpSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ds = resolve(process.argv[2] ?? '../acme-ds')
const out = resolve('src/styles/mak-ui')

cpSync(`${ds}/packages/tokens/dist/css/variables.css`, `${out}/variables.css`)
const theme = readFileSync(`${ds}/packages/tailwind/theme.css`, 'utf8').replace(
  "@import '@acme/tokens/variables.css';",
  "@import './variables.css';",
)
writeFileSync(`${out}/theme.css`, theme)
for (const f of ['index.js', 'no-raw-values.js', 'patterns.js']) {
  cpSync(`${ds}/packages/lint/src/eslint/${f}`, `tools/eslint-plugin-acme/${f}`)
}
console.log(`Synced mak UI tokens, theme and lint rule from ${ds}`)
