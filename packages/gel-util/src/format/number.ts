/**
 * // number或number string
// 千分位逗号
// 保留4位小数
// 是否补0
 * @param number 
 * @param _toThousands 
 * @param fixed 
 * @param add0 
 * 
 * @deprecated 请使用 formatNumber 代替
 * @returns 
 */
export function numberFormat(
  number: number | string,
  _toThousands: boolean = false,
  fixed: number = 4,
  add0: boolean = false
): string {
  if (isNaN(Number(number))) {
    return ''
  }
  number = Number(number).toFixed(fixed)
  number = add0 ? number : Number(number) + ''
  const _arr = number.split('.')
  _arr[0] = _toThousands ? toThousands(_arr[0]) : _arr[0]
  return _arr.join('.')
}

function toThousands(num: number | string): string {
  const numStr = (num || 0).toString()
  const digits: string[] = numStr.split('')
  let result: string[] = []
  let counter = 0

  for (let i = digits.length - 1; i >= 0; i--) {
    counter++
    result.unshift(digits[i])
    if (!(counter % 3) && i !== 0 && digits[i - 1] !== '-') {
      result.unshift(',')
    }
  }
  return result.join('')
}
