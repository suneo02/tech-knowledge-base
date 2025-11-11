/**
 * 优化过的处理标记函数，支持更多复杂场景和更智能的匹配
 *
 * @example
 * // 输入: "请访问 @企业名称 的网址（ @网站 ）"
 * // 输出: "请访问 {{companyName}} 的网址（ {{website}} ）"
 *
 * @param prompt - 原始提示词
 * @param columns - 可用的列定义
 * @param options - 额外配置项
 * @returns 处理后的提示词
 */
export const processMentions = (prompt: string, columns: { value: string; label: string; field: string }[]): string => {
  let text = prompt
  // 按 name 长度降序排序，确保长的先匹配
  const sortedList = [...columns].sort((a, b) => b.label.length - a.label.length)

  sortedList.forEach((item) => {
    // 转义正则中的特殊字符（如 *、. 等）
    const escapedName = item.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // 构建匹配 @名称 的正则
    const regex = new RegExp(`@${escapedName}`, 'g')
    // 替换为 {{id}}
    text = text.replace(regex, `{{${item.field}}}`)
  })

  return text
}
