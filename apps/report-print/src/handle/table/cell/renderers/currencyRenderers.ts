import { t } from '@/utils/lang'
import { ConfigTableCellJsonConfig, CorpBasicInfo } from 'gel-types'
import { formatMoney } from 'report-util/format'
import { isStringOrNumber } from '../validate'

/**
 * @deprecated 请使用 formatNumber 代替
 * 安全格式化货币
 * @param value 要格式化的值
 * @returns 格式化后的货币字符串
 */
export function safeFormatMoney(
  value: any,
  options?: ConfigTableCellJsonConfig['renderConfig'],
  record?: CorpBasicInfo
): string {
  try {
    if (value == null) {
      return '--'
    }

    let unitStr =
      options?.unitField && record?.[options.unitField] ? String(record[options.unitField]) : options?.unit || ''

    if (options?.unitPrefix && options?.unitPrefixIntl) {
      unitStr = t(options.unitPrefixIntl, options.unitPrefix) + unitStr
    }

    if (isStringOrNumber(value)) {
      return formatMoney(value, {
        showUnit: !!unitStr,
        unit: unitStr,
      })
    }

    console.error('Invalid currency value for formatMoney:', value)
    return '--'
  } catch (error) {
    console.error('Error formatting money:', error)
    return '--'
  }
}

/**
 * 渲染货币字段
 * 将数值格式化为带千分位的货币格式
 *
 * @param txt 货币值
 * @returns 格式化后的货币字符串
 */
export function renderCurrency(
  txt: any,
  options?: ConfigTableCellJsonConfig['renderConfig'],
  record?: CorpBasicInfo
): string {
  return safeFormatMoney(txt, options, record)
}
