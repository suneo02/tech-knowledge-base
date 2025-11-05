import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'

/**
 * 处理提示词中的列标记
 * 将提示词中的 @标记 替换为对应列的 {{field}} 格式
 * 支持精确匹配、忽略空格匹配、部分匹配和反向部分匹配
 *
 * @example
 * // 如果有列 "注册资本" 字段名为 "registeredCapital"
 * // 输入: "请分析@注册资本金额"
 * // 输出: "请分析{{registeredCapital}}金额"
 *
 * @param prompt - 原始提示词
 * @param columns - 可用的列定义
 * @returns 处理后的提示词，@标记被替换为 {{field}} 格式
 */
export const processColumnTags = (prompt: string, columns: ExtendedColumnDefine[]): string => {
  console.log('🚀 ~ processColumnTags ~ columns:', columns)
  // 正则表达式匹配 @ 后面的内容，直到遇到另一个 @ 或者行尾
  const regex = /@([^@]+?)(?=@|$)/g
  const matches = prompt.match(regex) || []
  let updatedPrompt = prompt

  // 遍历所有匹配的 @标记
  matches.forEach((match) => {
    const originalText = match.slice(1).trim() // 移除 @ 符号并去除首尾空格

    // 按优先级尝试不同匹配策略
    let matchedColumn: ExtendedColumnDefine | undefined = undefined
    let remainingText = ''

    // 1. 精确匹配
    matchedColumn = columns.find((col) => col.title === originalText)

    // 2. 忽略空格匹配
    if (!matchedColumn) {
      const normalizedText = originalText.replace(/\s+/g, '')
      matchedColumn = columns.find((col) => {
        const normalizedColTitle = col.title.replace(/\s+/g, '')
        return normalizedText === normalizedColTitle
      })
    }

    // 3. 部分匹配 - 检查列标题是否包含在输入文本中
    if (!matchedColumn) {
      for (const col of columns) {
        // 尝试找出最长的列标题匹配
        if (originalText.includes(col.title)) {
          // 提取列标题后面的剩余文本
          const after = originalText.split(col.title)[1]

          // 如果找到了匹配并且比当前匹配更长，则更新匹配
          if (!matchedColumn || col.title.length > matchedColumn.title.length) {
            matchedColumn = col
            remainingText = after || ''
          }
        }
      }
    }

    // 4. 反向部分匹配 - 检查输入文本是否包含在列标题中
    if (!matchedColumn) {
      for (const col of columns) {
        if (col.title.includes(originalText)) {
          // 如果找到了匹配并且比当前匹配更长，则更新匹配
          if (!matchedColumn || originalText.length > matchedColumn.title.length) {
            matchedColumn = col
          }
        }
      }
    }

    if (matchedColumn) {
      // 将 @标记替换为 {{field}} + 剩余文本格式
      const replacement = `{{${matchedColumn.field}}}${remainingText}`
      updatedPrompt = updatedPrompt.replace(match, replacement)
    }
  })

  return updatedPrompt
}

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
export const processAdvancedTags = (prompt: string, columns: ExtendedColumnDefine[]): string => {
  let text = prompt
  // 按 name 长度降序排序，确保长的先匹配
  const sortedList = [...columns].sort((a, b) => b.title.length - a.title.length)

  sortedList.forEach((item) => {
    // 转义正则中的特殊字符（如 *、. 等）
    const escapedName = item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // 构建匹配 @名称 的正则
    const regex = new RegExp(`@${escapedName}`, 'g')
    // 替换为 {{id}}
    text = text.replace(regex, `{{${item.field}}}`)
  })

  return text
}

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
