/**
 * @name: 将数字转换成千分位
 * @param val 需要转换的数字
 * @return: 千分位字符串
 */
export function toThousandSeparator(val: any, decimalPlaces = 0) {
  decimalPlaces = Number(decimalPlaces)
  val = Number(val)
  if (decimalPlaces) {
    return `${val.toFixed(decimalPlaces)}`.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  } else if (val) {
    return `${val.toFixed(0)}`.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
  return val
}

/**
 * 本项目中使用的 intl 方法
 *
 * 可以替换文本中 {} 中的 值
 */
export function intlForIndicator(key: string, params: Record<string, string>, t: (key: string) => string) {
  const text = t(key)
  if (!params) return text
  return text.replace(/\{(.*?)\}/g, (match, p1) => params[p1] || match)
}
