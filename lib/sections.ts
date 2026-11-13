/** Headings every case study body must contain, in this order (the PRD's template). */
export const REQUIRED_SECTIONS = ['Quality problem', 'Strategy', 'Implementation', 'Reflection']

export function sectionHeadings(body: string) {
  return [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim())
}

/**
 * Splits a body at "## Reflection" so the page can place Results and "See it run" between
 * Implementation and Reflection, keeping the template order without authors placing them.
 */
export function splitAtReflection(body: string): [before: string, after: string] {
  const i = body.search(/^## Reflection$/m)
  return i === -1 ? [body, ''] : [body.slice(0, i), body.slice(i)]
}
