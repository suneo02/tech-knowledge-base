import { formatNumber } from '@/format'
import { ConfigTableCellRenderOptions } from 'gel-types'
import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { isStringOrNumber } from '../validate'

export const renderNumber: ReportSimpleTableCellRenderFunc = (value, record, config, { t }) => {
  try {
    let renderConfig: ConfigTableCellRenderOptions = {}
    if (config && config.renderConfig) {
      renderConfig = config.renderConfig
    }
    if (value == null || !isStringOrNumber(value)) {
      if (value != null) {
        console.error('value is not a string or number', value)
      }
      return DEFAULT_EMPTY_TEXT
    }
    if (renderConfig.showZeroAsDefault) {
      if (value === 0 || value === '0') {
        return DEFAULT_EMPTY_TEXT
      }
    }
    let unitParsed = renderConfig.unitIntl ? t(renderConfig.unitIntl, renderConfig.unit) : renderConfig.unit || ''
    if (record && renderConfig.unitField) {
      unitParsed = record[renderConfig.unitField]
    }
    const unitPrefix = renderConfig.unitPrefixIntl
      ? t(renderConfig.unitPrefixIntl, renderConfig.unitPrefix)
      : renderConfig.unitPrefix || ''
    unitParsed = unitPrefix + unitParsed

    return formatNumber(value, {
      decimalPlaces: renderConfig?.decimalPlaces,
      useThousandSeparator: renderConfig?.useThousandSeparator,
      showUnit: renderConfig?.showUnit,
      unit: unitParsed,
    })
  } catch (error) {
    console.error('renderNumber error', error)
    return DEFAULT_EMPTY_TEXT
  }
}
