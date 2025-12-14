export const maskName = (companyName: string) => {
  // 非字符串或空值直接返回
  if (!companyName || typeof companyName !== 'string') return ''

  const len = companyName.length

  // 4个字及以内不脱敏
  if (len <= 4) {
    return companyName
  }

  // 超过4个字，保留前二后二，中间用***代替
  const firstTwo = companyName.substring(0, 2)
  const lastTwo = companyName.substring(len - 2)

  return `${firstTwo}***${lastTwo}`
}
