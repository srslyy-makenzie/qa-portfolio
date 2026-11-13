/** href and src values from an HTML document (good enough for our own build output). */
export function extractLinks(html: string): string[] {
  return [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&'))
}

/** Skips in-page anchors, mail/tel links, data URIs and script URLs. */
export function isCheckable(link: string) {
  return !/^(#|mailto:|tel:|data:|javascript:)/.test(link)
}
