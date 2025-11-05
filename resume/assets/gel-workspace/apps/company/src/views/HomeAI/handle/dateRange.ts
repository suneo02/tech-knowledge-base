/**
 * 计算企业数据统计的日期范围
 *
 * @description
 * 计算规则:
 * 1. 默认取当前日期前一天作为结束日期
 * 2. 如果是周一，结束日期往前推2天(取到上周五)
 * 3. 如果是周日，结束日期往前推1天(取到周六)
 * 4. 开始日期为结束日期往前推2天
 *
 * @example
 * // 假设今天是 2024-03-20 (周三)
 * getCorpStatsDateRange()
 * // 返回: { startDate: '20240318', endDate: '20240319' }
 *
 * // 假设今天是 2024-03-18 (周一)
 * getCorpStatsDateRange()
 * // 返回: { startDate: '20240315', endDate: '20240316' }
 *
 * @returns {object}
 * - startDate: 开始日期，格式 YYYYMMDD
 * - endDate: 结束日期，格式 YYYYMMDD
 * - createDateRange: 用于API请求的日期范围字符串，格式 YYYYMMDD~YYYYMMDD
 */
export function getCorpStatsDateRange() {
  const today = new Date()
  const weekDay = today.getDay()

  // 计算结束日期需要往前推的天数
  let daysToSubtract = 1 // 默认往前推1天
  if (weekDay === 1) {
    // 周一
    daysToSubtract = 3 // 往前推3天到上周五
  } else if (weekDay === 0) {
    // 周日
    daysToSubtract = 2 // 往前推2天到周五
  }

  // 计算结束日期
  const endDate = new Date(today)
  endDate.setDate(today.getDate() - daysToSubtract)

  // 计算开始日期 (结束日期往前推2天)
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 2)

  // 格式化日期为 YYYYMMDD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  const startDateStr = formatDate(startDate)
  const endDateStr = formatDate(endDate)

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    createDateRange: `${startDateStr}~${endDateStr}`,
  }
}
