// Minimal static file server for out/: trailing-slash routes resolve to index.html, unknown
// paths get 404.html with a 404 status (like the production host). Used by Playwright,
// Lighthouse CI and the resume PDF step, so they all test the real build output.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
}

export function resolveFile(root: string, urlPath: string): string | null {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  const base = join(root, clean)
  if (!base.startsWith(root)) return null
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

export function startServer(dir = 'out', port = 0): Promise<{ server: Server; url: string }> {
  const root = resolve(dir)
  const server = createServer((req, res) => {
    const file = resolveFile(root, req.url ?? '/')
    const target = file ?? join(root, '404.html')
    res.statusCode = file ? 200 : 404
    res.setHeader('Content-Type', TYPES[extname(target)] ?? 'application/octet-stream')
    createReadStream(target).pipe(res)
  })
  return new Promise((ok) =>
    server.listen(port, '127.0.0.1', () => {
      const address = server.address()
      const p = typeof address === 'object' && address ? address.port : port
      ok({ server, url: `http://127.0.0.1:${p}` })
    }),
  )
}
