import { isEn } from '@/intl'
import { EMPTY_PLACEHOLDER } from './text'

export const formatTime = (timeStr: string | number | undefined) => {
  if (timeStr == null) return '--'

  const time = timeStr?.toString()
  if (/^\d{4}$/.test(time)) {
    // 2010 格式, 直接返回
    return time
  }
  if (/(\d{4})-(\d{1}|\d{2})$/.test(time)) {
    // 2010-x 格式, 直接返回
    return time
  }
  if (/(\d{4})-(\d{1}|\d{2})-(\d{1}|\d{2})$/.test(time)) {
    // 2010-x-x 格式, 直接返回
    return time
  }
  if (/(\d{4})(\d{2})(\d{2})([^\d]+)(\d{4})(\d{2})(\d{2})/.test(time)) {
    return time.replace(/(\d{4})(\d{2})(\d{2})([^\d]+)((\d{4})(\d{2})(\d{2}))?/, '$1-$2-$3$4$6-$7-$8')
  } else if (/(\d{4})\/?(\d{2})\/?(\d{2})/.test(time)) {
    return time.replace(/(\d{4})\/?(\d{2})\/?(\d{2})/, '$1-$2-$3')
  } else if (/(\d{4})-(\d{2})-(\d{2})T00:00:00/.test(time)) {
    return time.replace(/(\d{4})-(\d{2})-(\d{2})T00:00:00/, '$1-$2-$3')
  } else if (/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/.test(time)) {
    return time.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3')
  } else if (/^[0-9]{6}$/.test(time)) {
    // 202002 格式, 返回 2020-02
    return time.replace(/(\d{4})(\d{2})/, '$1-$2')
  }
  if (time === '0') return EMPTY_PLACEHOLDER
  return time || EMPTY_PLACEHOLDER
}

export const formatTimeIntl = (data: string) => {
  if (data) {
    const timeArr = formatTime(data).split('-')
    const yearStr = isEn() ? '-' : '年'
    const monthStr = isEn() ? '-' : '月'
    const dayStr = isEn() ? '' : '日'
    return timeArr[0] + yearStr + timeArr[1] + monthStr + timeArr[2] + dayStr
  } else {
    return EMPTY_PLACEHOLDER
  }
}

export const formatUTCDate = (data: Date | string | number | undefined) => {
  try {
    if (data == null || data === '') return EMPTY_PLACEHOLDER

    const dateObj = data instanceof Date ? data : new Date(data as string | number)
    const y = dateObj.getFullYear().toString()
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const d = dateObj.getDate().toString().padStart(2, '0')
    const h = dateObj.getHours().toString().padStart(2, '0')
    const min = dateObj.getMinutes().toString().padStart(2, '0')
    const s = dateObj.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  } catch (error) {
    console.error('formatUTCDate error:', error)
    return EMPTY_PLACEHOLDER
  }
}
