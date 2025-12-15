import { ConfigTableCellJsonConfig } from 'gel-types'
import { isEn } from 'gel-util/intl'
import { renderNumber } from 'report-util/table'
import { TIntl } from 'report-util/types'
import styles from './stockChange.module.less'

/**
 * 
 * @param value 
  const valueString = value.toString()
  const numRendered = renderNumber(value, options, record)
  const $element = $('<span></span>')
  // 获取变化值
  if (valueString.startsWith('+')) {
    $element.addClass(styles.up)
  } else if (valueString.startsWith('-')) {
    $element.addClass(styles.down)
  }
  $element.append(numRendered)
  return $element
 * @param options 
 * @param record 
 */
export function renderStockChange(
  t: TIntl,
  value: any,
  options?: ConfigTableCellJsonConfig['renderConfig'],
  record?: any
) {
  const valueString = value.toString()
  const numRendered = renderNumber(value, options, record, {
    t,
    isEn: isEn(),
  })
  return <span className={valueString.startsWith('+') ? styles.up : styles.down}>{numRendered}</span>
}
