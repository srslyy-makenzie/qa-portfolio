import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the custom text styles so text-title-2 and text-foreground
// are not treated as conflicting (one is a font size, the other a color).
const twMerge = extendTailwindMerge({
  extend: {
    // h-control-md, size-control-sm: control heights from the size tokens.
    theme: { spacing: ['control-sm', 'control-md', 'control-lg'] },
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'title-1',
            'title-2',
            'title-3',
            'headline',
            'body',
            'body-sm',
            'caption',
            'code',
          ],
        },
      ],
      shadow: [{ shadow: ['elevation-1', 'elevation-2', 'elevation-3', 'elevation-4'] }],
    },
  },
})

/** Merge class names, letting later Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
