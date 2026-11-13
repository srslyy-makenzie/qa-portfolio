import type { NextConfig } from 'next'

// Static export: every route is prerendered to out/ and served from static hosting.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
}

export default config
