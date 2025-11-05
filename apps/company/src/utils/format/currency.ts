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

export const formatMoney = (amount: string | number, options?: MoneyOptions): string => {
  try {
    // 1. 输入检查：如果金额无效，返回 '--'
    if (amount == null || amount === 'undefined') {
      return '--'
    }

    // 2. 解析金额
    const numericAmount = parseFloat(String(amount))
    if (isNaN(numericAmount) || numericAmount === 0) {
      return '--'
    }

    // 3. 设置默认值
    const { decimalPlaces, scale = 1, showUnit = false } = options || {}

    const unit = options && 'showUnit' in options && 'unit' in options ? options.unit : ''

    // 检查：如果需要显示单位，但没有提供任何单位，抛出错误
    if (showUnit && !unit) {
      console.error('When showUnit is true, unit must be provided')
      return '--'
    }

    // 4. 处理缩放
    const scaledAmount = numericAmount / scale

    // 5. 格式化金额
    let formattedAmount: string
    if (decimalPlaces !== undefined) {
      // 如果指定了小数位数，使用 toFixed
      formattedAmount = scaledAmount.toFixed(decimalPlaces)
    } else {
      // 否则保留原始精度
      formattedAmount = String(scaledAmount)
      // 处理科学计数法
      if (formattedAmount.includes('e')) {
        const [base, exponent] = formattedAmount.split('e')
        const exp = parseInt(exponent)
        formattedAmount = exp < 0 
          ? Number(base).toFixed(Math.abs(exp))
          : base + '0'.repeat(exp)
      }
    }

    // 6. 分离整数部分和小数部分
    let [integerPart, decimalPart] = formattedAmount.split('.')
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

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
