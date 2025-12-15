/**
 * 格式化人数
 * 自动添加千分位和"人"单位
 * @example formatPeopleCount(1000) // 1,000人
 */

import { formatNumber } from './formatNumber'

export const formatPeopleCount = (count: string | number) => {
  return formatNumber(count, {
    decimalPlaces: 0,
    showUnit: true,
    unit: '人',
  })
}
