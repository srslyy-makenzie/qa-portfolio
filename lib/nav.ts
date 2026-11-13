export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Quality', href: '/quality/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Resume', href: '/resume/' },
  { label: 'Contact', href: '/contact/' },
] as const

/** Active for the exact page and, except Home, any page beneath it (/work/<slug>/). */
export function isActive(pathname: string, href: string) {
  const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`)
  if (href === '/') return pathname === '/'
  return norm(pathname).startsWith(norm(href))
}
