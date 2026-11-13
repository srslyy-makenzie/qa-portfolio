# QA Automation Engineer portfolio

Portfolio site built from the PRD *QA Automation Engineer Portfolio Website* (Nov 12, 2026). Next.js static
export on the **mak UI** design system. The site is its own flagship case study: its test suite, CI gates
and latest results are published on the `/quality/` page.

## Commands

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm build               # static export to out/, then resume.pdf + reports (scripts/postbuild.ts)
pnpm serve               # serve out/ at http://127.0.0.1:4173

pnpm lint                # ESLint incl. mak UI's acme/no-raw-values (semantic tokens only)
pnpm typecheck
pnpm test:coverage       # Vitest + Testing Library
pnpm test:all            # Playwright: chromium, firefox, webkit, mobile, a11y (axe × 4 themes), visual
pnpm lhci                # Lighthouse CI, budgets ≥ 95 on mobile
pnpm check:links         # link checker on out/ (add -- --external to request external URLs)
pnpm quality:collect     # reporters' JSON → content/quality/latest-run.json (rendered by /quality/)
pnpm fetch:repos         # GitHub repo metadata for the Projects page (build time only)
```

Playwright runs against the built site, so run `pnpm build` first. Order that publishes fresh results:
lint → typecheck → test:coverage → build → test:all → lhci → check:links → quality:collect → build.
`.github/workflows/ci.yml` does exactly that, then deploys `out/` to Cloudflare (main) or uploads a preview
version (pull requests). It needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

## Content (no component changes needed)

| What | Where |
| --- | --- |
| Name, title, positioning, links, core stack | `content/site.json` |
| Case studies | `content/work/<slug>/meta.json` + `index.mdx` |
| About, resume, projects | `content/about.json`, `resume.json`, `projects.json` |
| Quality page strategy and FAQ | `content/quality/strategy.json` |
| Generated (don't edit) | `content/quality/latest-run.json`, `content/repos.generated.json` |

Every file is validated with zod (`lib/schemas.ts`) at build time and in unit tests. A case study must
have the sections `Quality problem`, `Strategy`, `Implementation`, `Reflection` in that order, at least
one before/after metric, and repo + CI run + report links or `links.unavailableReason`. The page adds
Context, Results, "See it run" and Credits from `meta.json`. MDX components: `Callout`, `Decisions`,
`Pipeline`, `CodeTabs`/`CodeTab`; fenced code supports `title="…"`, `// [!code highlight]`,
`// [!code ++]` and `// [!code --]`.

Case studies with `"status": "draft"` show a "Draft case study" notice. Both current case studies,
the career narrative and resume are **placeholders** to replace with real work and numbers.

## Design system

- Components come from the mak UI shadcn registry (`components.json`, `@acme` →
  `https://mak-ui.makenziemoore.workers.dev/r/{name}.json`) into `components/ui/`.
- Tokens, the Tailwind theme and the lint rule are vendored from `../acme-ds` by `pnpm sync:ds`
  (into `src/styles/mak-ui/` and `tools/eslint-plugin-acme/`) because `@acme/*` isn't published.
- Theme: System/Light/Dark + High contrast (`.light`/`.dark` and `data-contrast="more"` on `<html>`).

## Visual baselines

Screenshots are per OS (`tests/e2e/__screenshots__/<platform>/`). Baselines for CI (Linux) are made in
Playwright's Docker image: `pnpm test:visual:update:linux`. Commit them before relying on the visual gate.
