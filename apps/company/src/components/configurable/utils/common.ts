export function debounce<T>(resumer: (params: T) => void, delay: number): (params: T) => void {
  let timer: NodeJS.Timeout
  return (params: T) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      resumer(params)
    }, delay)
  }
}

export function getBrowserLocale(): string | undefined {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }
  return 'zh-CN'
}

/**
 * 格式化货币金额，支持不同单位的转换和格式化
 *
 * @param amount - 金额数值或字符串，将被转换为数字类型
 * @param unit - 单位数值或字符串类型，决定金额的转换单位
 * @returns 返回格式化后的货币字符串，单位转换后保留两位小数，必要时返回整数部分
 *
 * 此函数旨在接收一定的金额数值与单位，将金额转换到指定单位后，格式化为易于阅读的字符串形式
 * 如果单位是字符串类型，则根据字符串内容确定转换的具体单位，否则直接使用传入的数值单位
 */
export function formatCurrency(amount: number | string, unit: number | '千元' | '万元' | '百万元' | '亿元' | '十亿元') {
  // 将金额转换为数字类型
  const _amount = Number(amount)
  // 定义单位变量，默认值为0（元）
  let _unit: number = 0

  // 判断单位类型，如果是字符串，则根据不同的单位字符串设定对应的数值单位
  if (typeof unit === 'string') {
    switch (unit) {
      case '千元':
        _unit = 3
        break
      case '万元':
        _unit = 4
        break
      case '百万元':
        _unit = 6
        break
      case '亿元':
        _unit = 8
        break
      case '十亿元':
        _unit = 9
        break
      default: // 默认是元
        _unit = 0
    }
  }

  // 计算除以10的幂（10^unit），实现单位转换
  const divisor = Math.pow(10, _unit)
  const formattedAmount = _amount / divisor

  // 格式化为字符串，保留两位小数
  const formattedString = formattedAmount.toFixed(2)

  // 判断小数部分是否为.00，如果是则返回整数部分，否则返回带有两位小数的字符串
  return formattedString.endsWith('.00') ? formattedAmount.toFixed(0) : formattedString
}
/**
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @description 判断是否是数组且不为空
 */
export const isArrayAndNotEmpty = (value: unknown): value is unknown[] & { length: number } => {
  return Array.isArray(value) && typeof value.length === 'number' && value.length > 0
}

/**
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @description 判断是对象且不为空对象
 */
export const isObjectAndNotEmpty = (value: unknown): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) && // 确保不是数组
    Object.keys(value).length > 0 // 检查是否有属性
  )
}
