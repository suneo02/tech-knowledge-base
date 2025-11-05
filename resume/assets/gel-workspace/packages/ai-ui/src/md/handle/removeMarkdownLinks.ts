/**
 * 移除文本中的 Markdown 链接格式 和 溯源标记
 * @param {string} text - 包含 Markdown 链接的文本
 * @returns {string} 处理后的纯文本
 * @example
 * removeMarkdownLinks('[小米科技](ner:company:1252099345)，正式名称为小米集团【0(0~10，20~30)】')
 * // 返回: '小米科技，正式名称为小米集团'
 */
export const removeMarkdownLinks = (text: string): string => {
  if (!text || typeof text !== 'string') return ''

  // 直接查找所有可能的溯源标记，使用预处理提取它们，避免替换导致的位置问题
  const tracePattern = /【(\d+)\(([\d~,，]+?)\)】/g
  const linkPattern = /\[([^\]]+)\]\([^)]+\)/g
  return text.replace(linkPattern, '$1').replace(tracePattern, '')
}
