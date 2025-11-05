import type { MarkdownTable } from './types'

const DEFAULT_CONFIG = {
  minDelimiters: 2,
  requireHeader: true,
  trimCells: true,
}

/**
 * 解析分隔符行中的对齐方式
 * @param delimiter 分隔符行文本，如 ':---:' 或 '---' 或 ':---' 或 '---:'
 * @returns 对齐方式
 */
const parseAlignment = (delimiter: string): 'left' | 'center' | 'right' => {
  const trimmed = delimiter.trim()
  const hasLeft = trimmed.startsWith(':')
  const hasRight = trimmed.endsWith(':')

  if (hasLeft && hasRight) return 'center'
  if (hasRight) return 'right'
  if (hasLeft) return 'left'
  return 'left' // 默认左对齐
}

/**
 * 判断文本是否包含 Markdown 表格
 */
export const hasMarkdownTable = (text: string): boolean => {
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|')) {
      // 检查下一行是否为分隔行
      const nextLine = lines[i + 1]
      if (nextLine && /^\s*\|?\s*[-:]+[-| :]+\s*\|?\s*$/.test(nextLine)) {
        return true
      }
    }
  }
  return false
}

/**
 * 从文本中提取表格内容
 */
export const extractTableContent = (text: string): string => {
  const lines = text.split('\n')
  const tableLines: string[] = []
  let isInTable = false
  let delimiterFound = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 检查是否进入表格
    if (!isInTable && trimmedLine.includes('|')) {
      isInTable = true
      tableLines.push(line)
      continue
    }

    // 检查分隔符行
    if (isInTable && !delimiterFound && /^\s*\|?\s*[-:]+[-| :]+\s*\|?\s*$/.test(trimmedLine)) {
      delimiterFound = true
      tableLines.push(line)
      continue
    }

    // 收集表格数据行
    if (isInTable && delimiterFound) {
      if (trimmedLine.includes('|')) {
        tableLines.push(line)
      } else {
        break // 表格结束
      }
    }
  }

  return tableLines.join('\n')
}

/**
 * 解析表格行
 */
const parseTableRow = (line: string, trim = true): string[] => {
  const cells = line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')

  return trim ? cells.map((cell) => cell.trim()) : cells
}

/**
 * 解析 Markdown 表格文本
 */
export const parseMarkdownTable = (text: string): MarkdownTable => {
  const result: MarkdownTable = {
    isTable: false,
    headers: [],
    rows: [],
    rawText: text,
  }

  const lines = text.split('\n').filter((line) => line.trim())
  if (lines.length < 2) return result

  // 查找表格开始位置
  let startIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|')) {
      const nextLine = lines[i + 1]
      if (nextLine && /^\s*\|?\s*[-:]+[-| :]+\s*\|?\s*$/.test(nextLine)) {
        startIndex = i
        break
      }
    }
  }

  if (startIndex === -1) return result

  // 解析表头
  const headerLine = lines[startIndex]
  const headers = parseTableRow(headerLine, DEFAULT_CONFIG.trimCells)
  if (headers.length < DEFAULT_CONFIG.minDelimiters) {
    return result
  }

  // 解析分隔符行，获取对齐方式
  const delimiterLine = lines[startIndex + 1]
  const delimiters = parseTableRow(delimiterLine, DEFAULT_CONFIG.trimCells)
  const alignments = delimiters.map(parseAlignment)

  // 解析数据行
  const rows: string[][] = []
  for (let i = startIndex + 2; i < lines.length; i++) {
    const line = lines[i]
    if (!line.includes('|')) break
    const row = parseTableRow(line, DEFAULT_CONFIG.trimCells)
    if (row.length === headers.length) {
      rows.push(row)
    }
  }

  return {
    isTable: true,
    headers,
    rows,
    rawText: text,
    alignments,
  }
}

/**
 * 将表格数据转换为格式化的 Markdown 表格文本
 */
export const formatMarkdownTable = (table: MarkdownTable): string => {
  if (!table.isTable || !table.headers.length) return ''

  const formatRow = (cells: string[]): string => `| ${cells.join(' | ')} |`

  // 根据对齐方式生成分隔符
  const delimiter = table.headers.map((_, index) => {
    const alignment = table.alignments?.[index] || 'left'
    switch (alignment) {
      case 'center':
        return ':---:'
      case 'right':
        return '---:'
      case 'left':
      default:
        return ':---'
    }
  })

  const rows = [formatRow(table.headers), formatRow(delimiter), ...table.rows.map((row: string[]) => formatRow(row))]

  return rows.join('\n')
}
