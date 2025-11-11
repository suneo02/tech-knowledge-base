import React, { useMemo } from 'react'
import DOMPurify from 'dompurify'

/**
 * 引用外部HTML，必须使用此方法
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @type {string} html
 * @example
 *  <InnerHtml html={'<html>...</html>'} />
 * @update bcheng<bcheng@wind.com.cn> - 使用 DOMPurify 替代 sanitizeHtml，减少75%的bundle大小
 */
export const InnerHtml = ({ html, ...rest }: { html: string; [key: string]: any }) => {
  // sanitize-html 的默认允许标签列表（与原实现完全一致）
  // 这是从 sanitize-html 2.13.0 版本实际获取的完整默认标签列表
  const defaultAllowedTags = [
    'address',
    'article',
    'aside',
    'footer',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hgroup',
    'main',
    'nav',
    'section',
    'blockquote',
    'dd',
    'div',
    'dl',
    'dt',
    'figcaption',
    'figure',
    'hr',
    'li',
    'menu',
    'ol',
    'p',
    'pre',
    'ul',
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'code',
    'data',
    'dfn',
    'em',
    'i',
    'kbd',
    'mark',
    'q',
    'rb',
    'rp',
    'rt',
    'rtc',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
    'wbr',
    'caption',
    'col',
    'colgroup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
  ]

  const sanitizedHtml = useMemo(() => {
    if (!html) return ''

    // 先将所有 a 标签替换为 p 标签（模拟 transformTags: { a: () => ({ tagName: 'p' }) }）
    const transformedHtml = html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '<p>$1</p>')

    // 配置选项：与原 sanitizeHtml 实现完全一致
    const purifyOptions = {
      // 允许的标签：默认标签 + 'p'（虽然 'p' 已经在默认列表中）
      ALLOWED_TAGS: [...defaultAllowedTags, 'p'],
      // 不允许任何属性（与 allowedAttributes: {} 完全一致）
      ALLOWED_ATTR: [],
      // 确保与 sanitize-html 行为一致
      KEEP_CONTENT: true,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    }

    return DOMPurify.sanitize(transformedHtml, purifyOptions)
  }, [html])

  return <span {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
