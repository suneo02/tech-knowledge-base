export const formatTime = (timeStr: string) => {
  let time = timeStr
  if (typeof time === 'number') {
    time = timeStr?.toString()
  }
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
  if (time === '0') return '--'
  return time || '--'
}

export const formatTimeIntl = (data) => {
  if (data) {
    const timeArr = formatTime(data).split('-')
    const yearStr = window.en_access_config ? '-' : '年'
    const monthStr = window.en_access_config ? '-' : '月'
    const dayStr = window.en_access_config ? '' : '日'
    return timeArr[0] + yearStr + timeArr[1] + monthStr + timeArr[2] + dayStr
  } else {
    return '--'
  }
}
