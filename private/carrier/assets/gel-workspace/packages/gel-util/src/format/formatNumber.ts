/**
 * 核心格式化选项
 */
export type FormatNumberOptions = {
  decimalPlaces?: number // 小数位数
  scale?: number // 缩放比例
  showUnit?: boolean // 是否显示单位
  unit?: string // 单位
  useThousandSeparator?: boolean // 是否使用千分位分隔符
}

/**
 * 核心格式化函数，处理通用的数值格式化逻辑
 * 供其他格式化函数调用，如货币和一般数字格式化
 */
export const formatNumber = (value: string | number, options?: FormatNumberOptions): string => {
  try {
    // 1. 输入检查：如果数值无效，返回 '--'
    if (value == null || value === 'undefined') {
      return '--'
    }

    // 2. 解析数值
    const numericValue = parseFloat(String(value))
    if (isNaN(numericValue)) {
      return '--'
    }
    if (numericValue === 0) {
      return '0'
    }

    // 3. 设置默认值
    const { decimalPlaces, scale = 1, showUnit = false, unit = '', useThousandSeparator = true } = options || {}

    // 检查：如果需要显示单位，但没有提供任何单位，抛出错误
    if (showUnit && !unit) {
      console.error('When showUnit is true, unit must be provided')
      return '--'
    }

    // 4. 处理缩放
    const scaledValue = numericValue / scale

    // 5. 格式化数值
    let formattedValue: string
    if (decimalPlaces !== undefined) {
      // 如果指定了小数位数，使用 toFixed
      formattedValue = scaledValue.toFixed(decimalPlaces)
    } else {
      // 否则保留原始精度
      formattedValue = String(scaledValue)
      // 处理科学计数法
      if (formattedValue.includes('e')) {
        const [base, exponent] = formattedValue.split('e')
        const exp = parseInt(exponent)
        formattedValue = exp < 0 ? Number(base).toFixed(Math.abs(exp)) : base + '0'.repeat(exp)
      }
    }

    // 6. 分离整数部分和小数部分
    let [integerPart, decimalPart] = formattedValue.split('.')

    // 只有当 useThousandSeparator 为 true 时才添加千分位分隔符
    if (useThousandSeparator) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    // 7. 拼接结果
    let result = integerPart
    if (decimalPart !== undefined) {
      result += '.' + decimalPart
    }

    // 8. 添加单位
    if (showUnit && unit) {
      result += unit
    }

    return result
  } catch (e) {
    console.error(e)
    return '--'
  }
}
