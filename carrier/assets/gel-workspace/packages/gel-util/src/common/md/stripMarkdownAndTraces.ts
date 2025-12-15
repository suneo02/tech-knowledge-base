/**
 * 移除文本中的 Markdown 链接和溯源标记，还原为纯文本
 *
 * 该函数会移除：
 * 1. Markdown 链接格式：`[文本](链接)` → `文本`
 * 2. 溯源标记：`【索引(位置)】` → 空
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {string} text - 包含 Markdown 链接和溯源标记的文本
 * @returns {string} 处理后的纯文本
 *
 * @example
 * // 场景：移除 Markdown 链接和溯源标记
 * const text = '[小米科技](ner:company:1252099345)成立于2010年【0(0~10)】'
 * const result = stripMarkdownAndTraces(text)
 * // 返回: '小米科技成立于2010年'
 *
 * @example
 * // 场景：移除多个溯源位置的标记
 * const text = '[华为](ner:company:123)和[小米](ner:company:456)【0(0~10，20~30)】【1(50~60)】'
 * const result = stripMarkdownAndTraces(text)
 * // 返回: '华为和小米'
 */
export const stripMarkdownAndTraces = (text: string): string => {
  if (!text || typeof text !== 'string') return ''

  // 移除 Markdown 链接格式：[文本](链接) → 文本
  const linkPattern = /\[([^\]]+)\]\([^)]+\)/g
  // 移除溯源标记：【索引(位置)】 → 空
  const tracePattern = /【(\d+)\(([\d~,，]+?)\)】/g

  return text.replace(linkPattern, '$1').replace(tracePattern, '')
}
