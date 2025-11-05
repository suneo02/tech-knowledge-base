import { isEnForRPPrint, t } from '@/utils/lang'
import { ConfigTableCellJsonConfig } from 'gel-types'
import { renderNumber } from 'report-util/table'
import styles from './stockChange.module.less'

export function renderStockChange(value: any, options?: ConfigTableCellJsonConfig, record?: any) {
  const valueString = value.toString()
  const numRendered = renderNumber(value, record, options, {
    t,
    isEn: isEnForRPPrint(),
  })
  const $element = $('<span></span>')
  // 获取变化值
  if (valueString.startsWith('+')) {
    $element.addClass(styles.up)
  } else if (valueString.startsWith('-')) {
    $element.addClass(styles.down)
  }
  $element.append(numRendered.toString())
  return $element
}
