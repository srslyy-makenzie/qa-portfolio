import rehypeShiki from '@shikijs/rehype'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { createCssVariablesTheme, type ShikiTransformer } from 'shiki'
import { mdxComponents } from '@/components/mdx'

// Colors come from CSS variables that globals.css maps onto design tokens, so code blocks
// follow light, dark and high contrast with no second theme. Highlighting runs at build time.
const tokenTheme = createCssVariablesTheme({
  name: 'mak-ui-tokens',
  variablePrefix: '--shiki-',
  fontStyle: true,
})

/** Copies the fence's title="…" and language onto <pre> for the code block header. */
const transformerMeta: ShikiTransformer = {
  name: 'meta-title',
  pre(node) {
    const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1]
    if (title) node.properties['data-title'] = title
    node.properties['data-language'] = this.options.lang
  },
}

export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      // Case study bodies are our own committed files, and their components take array/object
      // props (Decisions rows, Pipeline steps), so JS expressions are allowed. Dangerous JS
      // (eval, Function, process, require …) stays blocked.
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              theme: tokenTheme,
              transformers: [
                transformerMeta,
                transformerNotationHighlight(),
                transformerNotationDiff(),
              ],
            },
          ],
        ],
      },
    },
  })
  return content
}
