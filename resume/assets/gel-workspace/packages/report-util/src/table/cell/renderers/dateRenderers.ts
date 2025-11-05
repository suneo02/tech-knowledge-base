import { configDetailIntlHelper } from '@/corpConfigJson/intlHelper'
import { formatTime } from '@/format/time'
import { ConfigTableCellRenderOptions } from 'gel-types'
import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { isStringOrNumber } from '../validate'

/**
 * 安全格式化日期
 * @param value 要格式化的值
 * @returns 格式化后的日期字符串
 */
export function safeFormatTime(value: any, emptyText = DEFAULT_EMPTY_TEXT): string {
  try {
    if (value == null) {
      return emptyText
    }

    if (isStringOrNumber(value)) {
      return formatTime(value, emptyText)
    }

    console.error('Invalid date value for formatTime:', value)
    return emptyText
  } catch (error) {
    console.error('Error formatting time:', error)
    return emptyText
  }
}

/**
 * 渲染简单日期字段
 * 将日期值格式化为标准日期格式
 *
 * @param txt 日期值
 * @param options 配置项
 * @returns 格式化后的日期字符串
 */
export const renderSimpleDate: ReportSimpleTableCellRenderFunc = (txt, _record, config, { t }) => {
  let renderConfig: ConfigTableCellRenderOptions = {}
  if (config) {
    renderConfig = config.renderConfig
  }
  let emptyText = DEFAULT_EMPTY_TEXT
  if (renderConfig?.emptyText) {
    emptyText = configDetailIntlHelper(renderConfig, 'emptyText', t)
  }
  return safeFormatTime(txt, emptyText)
}

/**
 * 渲染日期范围
 * 将开始日期和结束日期组合成范围展示
 *
 * @param _ 无用参数
 * @param record 数据记录
 * @param config 配置项
 * @returns 格式化后的日期范围
 */
export const renderDateRange: ReportSimpleTableCellRenderFunc = (_txt, record, config, { t }) => {
  try {
    let renderConfig: ConfigTableCellRenderOptions = {}
    if (config) {
      renderConfig = config.renderConfig
    }
    const startField = renderConfig?.startField
    const endField = renderConfig?.endField

    const startValue = record[startField]
    const endValue = record[endField]

    // 如果都没有 使用 emptyText
    if (!startValue && !endValue) {
      if (renderConfig?.emptyText) {
        return configDetailIntlHelper(renderConfig, 'emptyText', t)
      }
      return DEFAULT_EMPTY_TEXT
    }

    const connector = configDetailIntlHelper(renderConfig, 'connector', t)
    const startEmptyText = configDetailIntlHelper(renderConfig, 'emptyStartText', t)
    const emptyEndText = configDetailIntlHelper(renderConfig, 'emptyEndText', t)

    // 获取开始日期和结束日期
    const formattedStartDate = safeFormatTime(startValue, startEmptyText)
    const formattedEndDate = safeFormatTime(endValue, emptyEndText)

    return `${formattedStartDate} ${connector} ${formattedEndDate}`
  } catch (error) {
    console.error('Error rendering date range:', error)
    return DEFAULT_EMPTY_TEXT
  }
}
