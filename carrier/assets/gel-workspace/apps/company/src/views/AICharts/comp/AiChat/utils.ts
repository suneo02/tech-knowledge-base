export function categorizeByTime(data) {
  const now = new Date()
  const nowUTC = new Date(now.toISOString().slice(0, 23) + 'Z') // 统一使用UTC时间处理

  // 获取今天的UTC开始时间（00:00:00.000）
  const todayStart = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate()))

  // 计算本周周一UTC开始时间
  const mondayStart = new Date(todayStart)
  const dayOfWeek = nowUTC.getUTCDay() || 7 // 转换周日为7（ISO标准：周一为1，周日为7）
  mondayStart.setUTCDate(mondayStart.getUTCDate() - (dayOfWeek - 1))

  // 计算30天前的UTC开始时间
  const thirtyDaysAgo = new Date(todayStart)
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30)

  const results = {
    today: {
      label: '今天',
      list: [],
    },
    thisWeek: {
      label: '本周',
      list: [],
    },
    last30Days: {
      label: '近30天',
      list: [],
    },
    earlier: {
      label: '更早',
      list: [],
    },
  }

  data?.forEach((item) => {
    const itemTime = new Date(item.updatedAt)

    if (itemTime >= todayStart) {
      results.today.list.push(item)
    } else if (itemTime >= mondayStart) {
      results.thisWeek.list.push(item)
    } else if (itemTime >= thirtyDaysAgo) {
      results.last30Days.list.push(item)
    } else {
      results.earlier.list.push(item)
    }
  })

  return results
}
