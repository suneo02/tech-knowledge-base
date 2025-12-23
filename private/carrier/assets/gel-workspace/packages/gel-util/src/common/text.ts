import React from 'react'

/**
 * 智能截取文本，确保高亮关键词及其上下文都能显示
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @param length 目标长度
 * @returns 截取后的文本
 */
export const smartTextTruncate = (text: string, keyword: string, length: number = 200): string => {
  if (!keyword.trim() || !text) {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase())
  if (keywordIndex === -1) {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  const keywordLength = keyword.length
  const contextLength = Math.floor((length - keywordLength) / 2)

  let start = Math.max(0, keywordIndex - contextLength)
  let end = Math.min(text.length, keywordIndex + keywordLength + contextLength)

  // 调整起始位置，避免截断单词
  while (start > 0 && text[start] !== ' ' && text[start] !== '\n') {
    start--
  }

  // 调整结束位置，避免截断单词
  while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
    end++
  }

  let result = text.substring(start, end)

  // 添加省略号
  if (start > 0) {
    result = '...' + result
  }
  if (end < text.length) {
    result = result + '...'
  }

  return result
}

/**
 * 高亮文本中的搜索关键词
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @param highlightClassName 高亮样式类名
 * @returns 包含高亮标记的 React 元素数组
 */
export const highlightText = (text: string, keyword: string): React.ReactNode[] => {
  if (!keyword.trim() || !text) {
    return [text]
  }

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  const parts = text.split(regex)

  const highlightStyle = {
    color: '#00aec7',
  }

  return parts.map((part, index) => {
    // 检查当前部分是否匹配关键词（不区分大小写）
    if (part.toLowerCase() === keyword.toLowerCase()) {
      return React.createElement(
        'span',
        {
          key: index,
          style: highlightStyle,
        },
        part
      )
    }
    return part
  })
}
