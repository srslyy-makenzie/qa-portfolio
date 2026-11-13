import Script from 'next/script'

/**
 * Privacy-friendly analytics (Plausible: no cookies, no personal data). Off unless
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time, so local builds and tests send nothing.
 * The outbound-links variant records clicks to GitHub, reports and the resume.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (!domain) return null
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.outbound-links.file-downloads.js"
      strategy="afterInteractive"
    />
  )
}
