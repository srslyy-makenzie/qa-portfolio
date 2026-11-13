// Shared detectors for off-system values. Each returns a short reason or null.

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/i
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\(/i

// Tailwind arbitrary values like p-[13px] or bg-[#fff]. Allowed: values that only read a
// CSS variable (w-[var(--anchor-width)]) and arbitrary variants (data-[side=top]:), which
// select states rather than set values.
const ARBITRARY = /(?:^|[\s:])!?-?[a-z][\w-]*-\[(?!var\(--|--)[^\]\s]+\](?!:)/i

// Tailwind palette classes (bg-blue-600) and the project's own primitive ramps (bg-brand-600).
const PALETTE_NAMES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|brand'
const PALETTE_CLASS = new RegExp(
  `(?:^|[\\s:])(?:bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|via|to|divide|placeholder|accent|caret|decoration|shadow|inset-shadow)-(?:(?:${PALETTE_NAMES})-\\d{2,3}|black|white)(?:\\/\\d+)?(?=$|\\s)`,
  'i',
)

/** @param {string} value */
export function findRawValue(value) {
  if (HEX.test(value)) return `raw hex color "${value.match(HEX)?.[0]}"`
  if (COLOR_FN.test(value)) return `raw color function "${value.match(COLOR_FN)?.[0]}"`
  const arbitrary = value.match(ARBITRARY)
  if (arbitrary) return `arbitrary value "${arbitrary[0].trim()}"`
  const palette = value.match(PALETTE_CLASS)
  if (palette) return `primitive palette class "${palette[0].trim()}"`
  return null
}

/** CSS lengths that should come from a spacing, size or radius token. */
const RAW_LENGTH = /(?:^|[\s(,])-?\d*\.?\d+(?:px|rem|em)\b/

/** @param {string} value */
export function findRawStyleValue(value) {
  const color = findRawValue(value)
  if (color) return color
  if (RAW_LENGTH.test(value) && !/var\(--/.test(value)) return `raw length "${value}"`
  return null
}
