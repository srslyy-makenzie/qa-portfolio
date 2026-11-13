import { findRawStyleValue, findRawValue } from './patterns.js'

const CLASS_ATTRS = new Set(['className', 'class'])
const CLASS_HELPERS = new Set(['cn', 'clsx', 'cx', 'cva', 'twMerge', 'twJoin'])

// Unitless style properties where a plain number is fine.
const UNITLESS_OK = new Set(['flex', 'flexGrow', 'flexShrink', 'order', 'opacity', 'fontWeight'])

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow raw colors, arbitrary values and primitive palette classes; use semantic tokens.',
    },
    messages: {
      raw: 'Off-system value: {{reason}}. Use a semantic token (e.g. bg-primary, text-muted-foreground, p-4) instead.',
    },
    schema: [],
  },
  create(context) {
    /** @param {import('estree').Node} node @param {(s: string) => string | null} check */
    function checkStrings(node, check) {
      if (!node) return
      switch (node.type) {
        case 'Literal':
          if (typeof node.value === 'string') report(node, check(node.value))
          break
        case 'TemplateLiteral':
          for (const quasi of node.quasis) report(quasi, check(quasi.value.cooked ?? ''))
          for (const expr of node.expressions) checkStrings(expr, check)
          break
        case 'ConditionalExpression':
          checkStrings(node.consequent, check)
          checkStrings(node.alternate, check)
          break
        case 'LogicalExpression':
        case 'BinaryExpression':
          checkStrings(node.left, check)
          checkStrings(node.right, check)
          break
        case 'ArrayExpression':
          for (const el of node.elements) if (el) checkStrings(el, check)
          break
        case 'ObjectExpression':
          // cn({ 'bg-red-500': isError }) and cva({ variants: { ... } })
          for (const prop of node.properties) {
            if (prop.type !== 'Property') continue
            if (prop.key.type === 'Literal' || prop.computed) checkStrings(prop.key, check)
            checkStrings(prop.value, check)
          }
          break
        // Nested cn(...) calls are checked by the CallExpression visitor below.
        default:
      }
    }

    /** @param {import('estree').Node} node @param {string | null} reason */
    function report(node, reason) {
      if (reason) context.report({ node, messageId: 'raw', data: { reason } })
    }

    /** @param {import('estree').ObjectExpression} obj */
    function checkStyleObject(obj) {
      for (const prop of obj.properties) {
        if (prop.type !== 'Property') continue
        const value = prop.value
        const key = prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value ?? '')
        if (value.type === 'Literal' && typeof value.value === 'number') {
          if (value.value !== 0 && !UNITLESS_OK.has(key)) {
            report(value, `raw number ${value.value} for "${key}"`)
          }
        } else {
          checkStrings(value, findRawStyleValue)
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null
        if (!name || !node.value) return
        const expr =
          node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value
        if (CLASS_ATTRS.has(name)) {
          checkStrings(/** @type {any} */ (expr), findRawValue)
        } else if (name === 'style' && expr.type === 'ObjectExpression') {
          checkStyleObject(expr)
        }
      },
      CallExpression(node) {
        const callee = node.callee
        if (callee.type === 'Identifier' && CLASS_HELPERS.has(callee.name)) {
          for (const arg of node.arguments) checkStrings(/** @type {any} */ (arg), findRawValue)
        }
      },
    }
  },
}
