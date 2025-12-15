import { formatNumber } from './formatNumber'

// 定义基础选项类型
type BaseMoneyOptions = {
  decimalPlaces?: number // 小数位数
  scale?: number // 缩放比例
}

// 定义带单位的选项类型
type WithUnitOptions = BaseMoneyOptions & {
  showUnit: true // 是否显示单位
  unit: string // 单位
}

// 定义不带单位的选项类型, 默认不显示单位
type WithoutUnitOptions = BaseMoneyOptions & {
  showUnit?: false // 是否显示单位
}

// 联合类型
type MoneyOptions = WithUnitOptions | WithoutUnitOptions

/**
 * 格式化货币金额
 * @param amount 金额
 * @param options 格式化选项
 * @returns 格式化后的金额字符串
 */
export const formatMoney = (amount: string | number, options?: MoneyOptions): string => {
  // 直接复用 formatNumber，转换选项类型
  return formatNumber(amount, { ...options, useThousandSeparator: true })
}

/**
 * 货币与单位与数词的结合
 * @example formatCurrency(1000, 'CNY', '万') // 1000万CNY
 *
 * @deprecated 旧版的 format
 */
export const formatCurrency = (money: string | number, currency?: string, numeral?: string) => {
  if (money === '0') return `0${currency ? `${currency}` : ''}`
  const formattedMoney = Number(money)
    ? Number(money)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : ''
  return formattedMoney ? `${formattedMoney}${numeral ? `${numeral}` : ''}${currency ? `${currency}` : ''}` : '--'
}

// 带千分位金额展示
export const formatMoneyComma = (txt: string | number) => {
  return formatMoney(txt, {
    decimalPlaces: 2,
    scale: 10000,
    showUnit: true,
    unit: '万',
  })
}
