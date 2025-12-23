import { CellData, HtmlUnit, SplitResult } from './type'

/**
 * 处理空内容的拆分结果
 * @param originalCellsData - 原始单元格数据
 * @returns 拆分结果
 */
export function handleEmptyContent(originalCellsData: CellData[]): SplitResult {
  return {
    firstLineData: originalCellsData.map((c) => ({
      ...c,
      html: c.html || '',
    })),
    remainingData: [],
    didSplit: false,
  }
}

/**
 * 处理无法容纳任何内容的情况
 * @param originalCellsData - 原始单元格数据
 * @returns 拆分结果
 */
export function handleNoFitContent(originalCellsData: CellData[]): SplitResult {
  console.warn('CellSplitter (单元格拆分器): 即便是单个纯文本字符也会导致行溢出。将返回空的第一行内容。')
  return {
    firstLineData: originalCellsData.map((c) => ({ ...c, html: '' })),
    remainingData: originalCellsData.map((c) => ({
      ...c,
      html: c.html || '',
    })),
    didSplit: true, // 被认为是拆分，因为没有内容适配，但有内容需要适配
  }
}

/**
 * 验证单元格数据是否包含内容
 * @param cellsData - 单元格数据数组
 * @returns 是否包含任何内容
 */

export function hasAnyContent(cellsData: CellData[]): boolean {
  try {
    return cellsData.some((c) => c.content.length > 0)
  } catch (error) {
    console.error('PDFPage: hasAnyContent 错误' + JSON.stringify(error))
    return false
  }
}

/**
 * 获取单元格数据中最大的纯文本长度
 * @param cellsData - 单元格数据数组
 * @returns 最大纯文本长度
 */

export function getMaxPlainTextLength(cellsData: CellData[]): number {
  return Math.max(...cellsData.map((c) => c.content.length))
} /**
 * Reconstructs an HTML string from an array of HTML units.
 * @param units Array of HtmlUnit objects.
 * @returns A single HTML string.
 */

export function reconstructHtmlFromUnits(units: HtmlUnit[]): string {
  return units.map((unit) => unit.htmlContent).join('')
} /**
 * Cleans and gets plain text from HTML.
 * @param html The HTML string.
 * @returns Plain text string.
 */

export function getPlainText(html: string): string {
  if (!html) return ''
  // Use jQuery to reliably get text content, which handles entities.
  const $div = $('<div>').html(html)
  return $div.text().trim()
}
