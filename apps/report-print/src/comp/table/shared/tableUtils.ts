/**
 * Shared utility functions for table components
 */

import { TableColProps } from '@/types/table'

/**
 * Table utility class with static helper methods
 */
export class TableUtils {
  /**
   * Validates that the container is a valid jQuery object
   */
  static validateContainer($container: JQuery): void {
    if (!$container || !($container instanceof jQuery)) {
      throw new Error('Table: container must be a jQuery object')
    }
  }

  /**
   * 渲染单元格内容，处理自定义渲染函数，并确保结果是有效的HTML内容
   * @param $cell - 单元格jQuery对象，用于设置内容
   * @param value - 单元格原始值
   * @param record - 行数据记录
   * @param index - 行索引
   * @param renderFn - 可选的自定义渲染函数
   */
  static renderCellContent(
    $cell: JQuery,
    value: any,
    record: any = null,
    index: number = 0,
    renderFn?: TableColProps['render']
  ): void {
    // 如果有自定义渲染函数，则使用它
    if (typeof renderFn === 'function') {
      // 调用渲染函数，确保结果是字符串
      try {
        const renderResult = renderFn(value, record, index)
        // 检查renderResult是否为有效的HTML内容
        if (renderResult === null || renderResult === undefined) {
          console.warn('renderResult is null or undefined', $cell, renderResult, value, record, index)
          $cell.text('') // 如果为null或undefined，显示空字符串
          // @ts-expect-error ttt
        } else if (renderResult && typeof renderResult?.jquery === 'string') {
          // 如果结果是jQuery对象，使用append
          $cell.empty().append(renderResult as JQuery)
        } else if (typeof renderResult === 'string') {
          $cell.html(renderResult) // 只有当结果是字符串时才使用html()
        } else {
          // 如果不是字符串，转换为字符串
          $cell.text(String(renderResult))
          if (typeof renderResult === 'object') {
            console.warn('renderResult is an object', $cell, renderResult)
          }
        }
      } catch (error) {
        console.error('Error in render function:', error)
        $cell.text(value !== undefined ? String(value) : '')
      }
    } else {
      // 没有自定义渲染函数，直接显示值
      $cell.text(value != null ? String(value) : '--')
    }
  }
}
