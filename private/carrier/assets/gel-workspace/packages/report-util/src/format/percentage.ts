/**
 * 展示百分比
 */
export const formatPercent = (value: string | number | null | undefined): string => {
  // 如果值为空，返回 '--'
  if (value === null || value === undefined || value === '') {
    return '--'
  }

  // 如果已经是百分比格式，直接返回
  if (typeof value === 'string' && value.endsWith('%')) {
    return value
  }

  try {
    // 转换为数字
    const num = typeof value === 'string' ? parseFloat(value) : value

    // 检查是否是有效数字
    if (isNaN(num)) {
      return '--'
    }

    // 格式化为百分比
    return `${num}%`
  } catch {
    return '--'
  }
}

/**
 * 展示百分比带两位小数
 */
export const formatPercentWithTwoDecimalWhenZero = (numParam: string | number | undefined) => {
  try {
    // 转换为 string，看是否是 0
    let numStr = String(numParam)
    if (numStr === '0') {
      return '0.00%'
    }
    return formatPercent(numStr)
  } catch (e) {
    console.error(e)
    return '--'
  }
}
