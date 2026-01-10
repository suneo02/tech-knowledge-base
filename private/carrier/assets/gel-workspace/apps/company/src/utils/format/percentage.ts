import {
  formatPercent as formatPercentUtil,
  formatPercentWithTwoDecimalWhenZero as formatPercentWithTwoDecimalWhenZeroUtil,
  formatText,
} from 'gel-util/format'

/**
 * 展示百分比
 */
export const formatPercent = formatPercentUtil

/**
 * 展示百分比带两位小数
 */
export const formatPercentWithTwoDecimalWhenZero = formatPercentWithTwoDecimalWhenZeroUtil

/**
 * 格式化股权比例显示，统一添加百分号
 * 用于 showShareRate 字段的展示
 * @param value - showShareRate 字段值
 * @returns 格式化后的股权比例字符串（带百分号）
 * @example
 * formatShareRate('25.5') // returns '25.5%'
 * formatShareRate('--') // returns '--'
 * formatShareRate(null) // returns '--'
 */
export function formatShareRate(value: string | number | null | undefined): string {
  const formatted = formatText(value)
  // 如果已经包含百分号或者是 '--'，直接返回
  if (!formatted || formatted === '--' || formatted.includes('%')) {
    return formatted
  }
  return `${formatted}%`
}
