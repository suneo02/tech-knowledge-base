import { formatMoney } from '@/format/currency'
import { ConfigTableCellRenderOptions } from 'gel-types'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { isStringOrNumber } from '../validate'

/**
 * @deprecated 请使用 formatNumber 代替
 * 安全格式化货币
 * @param value 要格式化的值
 * @returns 格式化后的货币字符串
 */
export const safeFormatMoney: ReportSimpleTableCellRenderFunc = (value, record, config, { t }) => {
  try {
    if (value == null) {
      return '--'
    }
    let renderConfig: ConfigTableCellRenderOptions = {}
    if (config) {
      renderConfig = config.renderConfig
    }

    let unitStr =
      renderConfig?.unitField && record?.[renderConfig.unitField]
        ? String(record[renderConfig.unitField])
        : renderConfig?.unit || ''

    if (renderConfig?.unitPrefix && renderConfig?.unitPrefixIntl) {
      unitStr = t(renderConfig.unitPrefixIntl, renderConfig.unitPrefix) + unitStr
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
export const renderCurrency: ReportSimpleTableCellRenderFunc = (txt, record, config, { t, isEn }) => {
  return safeFormatMoney(txt, record, config, { t, isEn })
}
