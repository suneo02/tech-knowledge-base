/**
 * @author suneo
 * @param dateStr
 */
export const formatFeaturedDate = (dateStr: string) => {
  try {
    if (dateStr.length == 8) {
      // 作兼容处理，为了 旧版后端数据
      return window.en_access_config ? dateStr.substring(0, 4) : dateStr.substring(0, 4) + '年'
    }
    // 匹配不同格式的正则表达式
    const yearMonthDayRegex = /^\d{4}-(\d{2})-(\d{2})$/ // yyyy-mm-dd
    const yearMonthRegex = /^\d{4}-(\d{2})$/ // yyyy-mm
    const yearRegex = /^\d{4}$/ // yyyy

    if (yearMonthDayRegex.test(dateStr)) {
      // 如果匹配 yyyy-mm-dd
      const [, month, day] = dateStr.match(yearMonthDayRegex)
      return `${dateStr.slice(0, 4)}年${month}月${day}日`
    } else if (yearMonthRegex.test(dateStr)) {
      // 如果匹配 yyyy-mm
      const [, month] = dateStr.match(yearMonthRegex)
      return `${dateStr.slice(0, 4)}年${month}月`
    } else if (yearRegex.test(dateStr)) {
      // 如果匹配 yyyy
      return `${dateStr}年`
    } else {
      // 不符合格式返回原字符串
      return dateStr
    }
  } catch (e) {
    console.error(e)
    return dateStr
  }
}
