/**
 * PDFPage 工具函数
 * 包含PDFPage类使用的所有辅助方法和工具函数
 */

import { generateSafeId } from '../../utils/idGenerator'
import { TableOptions, TableStructure } from './types'
/**
 * PDFPage 工具类
 * 提供处理表格和内容的静态工具方法
 */
export class PDFPageUtils {
  /**
   * 获取标准化的表格选项
   * @param options - 用户提供的选项
   * @returns 标准化的选项对象
   */
  static getTableOptions(options: TableOptions): TableOptions {
    const defaultOptions = {
      tableId: generateSafeId('table'),
      headerSelector: 'thead',
      bodySelector: 'tbody',
      rowSelector: 'tr',
    }

    return { ...defaultOptions, ...options }
  }

  /**
   * 获取表格jQuery元素
   * @param table - 表格内容
   * @param tableId - 表格ID
   * @returns 表格jQuery元素
   */
  static getTableElement(table: string | JQuery, tableId: string): JQuery {
    let $table: JQuery

    if (typeof table === 'string') {
      $table = $(table)
    } else {
      $table = table
    }

    // 如果表格没有ID，添加ID
    if (!$table.attr('id')) {
      $table.attr('id', tableId)
    }

    return $table
  }

  static generatePageId(pageIndex: number): string {
    return `page-${pageIndex}`
  }

  static generateHeaderId(pageId: string): string {
    return `${pageId}-header`
  }

  static generateContentId(pageId: string): string {
    return `${pageId}-content`
  }

  /**
   * 生成页面及其子元素的唯一ID。
   * @param pageIndex - 页面的1基索引。
   * @returns 包含页面、页眉和内容区域ID的对象。
   */
  static generatePageIds(pageIndex: number): {
    pageId: string
    headerId: string
    contentId: string
  } {
    const pageId = this.generatePageId(pageIndex)
    const headerId = this.generateHeaderId(pageId)
    const contentId = this.generateContentId(pageId)
    return { pageId, headerId, contentId }
  }

  /**
   * 分析表格结构，获取表头、表体和行信息
   * @param $table - 表格元素
   * @param options - 表格选项
   * @returns 表格结构分析结果
   */
  static analyzeTableStructure($table: JQuery, options: TableOptions): TableStructure {
    const $header = $table.find(options.headerSelector!)
    const $body = $table.find(options.bodySelector!)
    const $rows = $body.find(options.rowSelector!)

    // 动态判断表格是否有表头
    const hasHeader = $header.length > 0 && $header.children().length > 0

    return { $header, $body, $rows, hasHeader }
  }
}
