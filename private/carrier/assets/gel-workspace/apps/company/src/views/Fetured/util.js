import intl from '../../utils/intl'

export const formatUpdateTime = (date, updatefreq) => {
  if (date.length === 10) {
    if (updatefreq == 6) {
      return date.substring(0, 4) + (window.en_access_config ? '' : '年')
    } else if (updatefreq == 5 || updatefreq == 4 || updatefreq == 3) {
      return window.en_access_config
        ? date.substring(0, 7)
        : date.substring(0, 7).replace('-', window.en_access_config ? '' : '年') + (window.en_access_config ? '' : '月')
    } else {
      return window.en_access_config
        ? date
        : date.replace('-', window.en_access_config ? '' : '年').replace('-', window.en_access_config ? '' : '月') +
            (window.en_access_config ? '' : '日')
    }
  } else {
    return '--'
  }
}

export const updatefreqMap = {
  1: intl('437817', '每日更新'),
  2: intl('308613', '每周更新'),
  3: intl('308614', '每月更新'),
  4: intl('308615', '每季度更新'),
  5: intl('308616', '每半年更新'),
  6: intl('308617', '每年更新'),
}
