/**
 * Text Renderers Module
 *
 * This module provides utility functions for rendering text content in table cells.
 * It includes functions for safely converting various data types to displayable strings
 * and handling special rendering cases like arrays and objects.
 *
 * The module supports:
 * - Safe text conversion with fallbacks for null/undefined values
 * - Array rendering with items on separate lines
 * - Object property extraction and rendering
 * - Error handling for conversion failures
 */
import { ConfigTableCellRenderConfig } from 'gel-types'
import { DEFAULT_EMPTY_TEXT, safeToStringRender } from 'report-util/table'
import { tForRPPreview } from '../../../../utils'
import { handleConfigTableArray, handleConfigTableObjectKey } from './shared'

/**
 * 渲染普通文本字段
 * 将字段值安全地转换为可显示文本
 *
 * @param txt 字段值
 * @param record 数据行记录对象
 * @param config 单元格渲染配置
 * @returns 渲染后的ReactNode
 */
export function renderText(txt: any, _record: any, config: ConfigTableCellRenderConfig) {
  try {
    const renderNotArray = (txt: any) => {
      const valueHandled = handleConfigTableObjectKey(txt, config.renderConfig?.objectKeyForArray)
      return safeToStringRender(tForRPPreview, valueHandled, config.renderConfig)
    }

    return handleConfigTableArray(txt, config, renderNotArray)
  } catch (error) {
    console.error('Error rendering text:', error)
    return DEFAULT_EMPTY_TEXT
  }
}
