import { rawHtmlToJQuery } from '../../utils/html/RawHtml'
import { createParagraph } from '../paragraph/paragraph'
import paragraphStyles from '../paragraph/paragraph.module.less'
import { createHtmlTableElement } from '../table/HtmlTable'
import { RPPrintState } from '../TableSectionsHelper/type'
import { TableSectionsElements } from './type'

// 常见块级元素列表，用于判断节点内部是否含块级元素，以决定是否继续递归拆分
const BLOCK_TAGS = [
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'CANVAS',
  'DD',
  'DIV',
  'DL',
  'DT',
  'FIELDSET',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'FORM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'HR',
  'LI',
  'MAIN',
  'NAV',
  'NOSCRIPT',
  'OL',
  'P',
  'PRE',
  'SECTION',
  'TABLE',
  'TFOOT',
  'UL',
  'VIDEO',
]

const blockSelector = BLOCK_TAGS.map((t) => t.toLowerCase()).join(', ')

/**
 * 处理添加 rawHtml 节点
 *
 * 对于 纯 html ，需要拆分为 table 节点及文本节点，并添加到 elements 中
 * table 比较好处理，文本节点简单平铺即可
 * 对于 输入的 html 节点，需要递归查找
 * @param item
 * @param state
 * @param elements
 * @returns
 */
export const addRawHtml = (
  item: { type: 'rawHtml'; id: string },
  state: RPPrintState,
  elements: TableSectionsElements
) => {
  const html = state.htmlStore?.[item.id]

  if (!html || typeof html !== 'string') {
    // 没有可用的 html 内容，直接返回
    return
  }

  // 先对 html 字符串进行安全处理
  const sanitizedHtml = rawHtmlToJQuery(html)

  // 使用 jQuery 包装在容器中，方便遍历
  const $container = $('<div></div>').html(sanitizedHtml)

  /**
   * 深度优先遍历节点，按照文档流顺序将 table / heading / 文本节点
   * 拆分并添加到 elements 中。
   * @param jqNodes 要遍历的 jQuery 节点集合
   */
  const traverse = (jqNodes: JQuery) => {
    jqNodes.each((_, node) => {
      const $node = $(node as any)

      // 处理文本节点：仅当父元素不是 DIV/P 时才拆分；否则交由 DIV/P 逻辑统一处理
      if (node.nodeType === 3) {
        const text = ($node.text() || '').trim()
        if (text) {
          const parentTag = (node.parentElement?.tagName || '').toUpperCase()
          if (parentTag !== 'DIV' && parentTag !== 'P' && parentTag !== 'LI') {
            const $textEl = createParagraph(text)
            elements.push({ type: 'paragraph', element: $textEl })
          }
        }
        return
      }

      // 只处理元素节点
      if (node.nodeType !== 1) {
        return
      }

      const tagName = (node as HTMLElement).tagName.toUpperCase()

      // 若是 table
      if (tagName === 'TABLE') {
        elements.push({ type: 'table', element: createHtmlTableElement($node) })
        return
      }

      // 若是 heading
      if (/^H[1-6]$/.test(tagName)) {
        // 将所有层级的 heading 统一降级为 h5，保留原有内容及 class
        const $h5 = $('<h5></h5>').html($node.html())

        // 复制 class 等常用属性，保持样式一致
        const classAttr = $node.attr('class')
        if (classAttr) {
          $h5.attr('class', classAttr)
        }

        elements.push({ type: 'heading', element: $h5 })
        return
      }

      // 若是 div 或 p：
      // 1) 若其内部包含 table / heading 等块级元素，则递归处理子节点；
      // 2) 否则，将其行内内容整体作为一个段落。
      if (tagName === 'DIV' || tagName === 'P' || tagName === 'LI') {
        const hasBlockInside = $node.find(blockSelector).length > 0

        if (hasBlockInside) {
          traverse($node.contents() as any)
        } else {
          const textOrHtml = $node.html().trim()
          if (textOrHtml) {
            const $p = $('<p></p>').addClass(paragraphStyles['paragraph']).html(textOrHtml)
            elements.push({ type: 'paragraph', element: $p })
          }
        }
        return
      }

      // 对于其他元素（div、p 等），递归处理其子节点
      traverse($node.contents() as any)
    })
  }

  traverse($container.contents() as any)
}
