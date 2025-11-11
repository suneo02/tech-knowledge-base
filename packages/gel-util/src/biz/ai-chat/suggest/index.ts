import { DPUItem, RAGItem } from 'gel-api'

/**
 * 将字符串转换为安全的 HTML 属性值
 *
 * 规则：
 * - 移除或替换不安全的字符（换行符、引号、尖括号等）
 * - 保留字母、数字、下划线、连字符、点号
 * - 将其他字符替换为连字符
 * - 确保结果可以安全地用于 HTML 属性
 *
 * @param value - 原始字符串
 * @returns 安全的 HTML 属性值
 */
export const sanitizeForHtmlAttribute = (value: string): string => {
  if (!value) return ''

  return (
    value
      // 移除所有控制字符（包括换行符、回车符等）
      .replace(/[\r\n\t\x00-\x1F\x7F]/g, '')
      // 移除引号和尖括号
      .replace(/["'<>]/g, '')
      // 将空格和其他特殊字符替换为连字符
      .replace(/[^\w.-]/g, '-')
      // 移除连续的连字符
      .replace(/-+/g, '-')
      // 移除开头和结尾的连字符
      .replace(/^-+|-+$/g, '')
  )
}

/**
 * 获取表格引用资料的唯一键（已清理，可安全用于 HTML 属性）
 * @param table 表格数据
 * @returns 清理后的唯一键字符串
 */
export const getDPUId = (table: DPUItem): string => {
  try {
    const rawId = table.id
    return sanitizeForHtmlAttribute(rawId)
  } catch (error) {
    console.error('Error getting table unique key:', error)
    return `table_unknown_${Date.now()}`
  }
}

/**
 * 获取建议引用资料的唯一键（已清理，可安全用于 HTML 属性）
 * @param suggest 建议数据
 * @returns 清理后的唯一键字符串
 */
export const getRAGId = (suggest: RAGItem): string => {
  try {
    const rawId = suggest.docId || ''
    return sanitizeForHtmlAttribute(rawId)
  } catch (error) {
    console.error('Error getting suggest unique key:', error)
    return `suggest_unknown_${Date.now()}`
  }
}
