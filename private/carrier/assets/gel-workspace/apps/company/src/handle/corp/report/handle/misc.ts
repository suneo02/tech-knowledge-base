import { getVipInfo } from '@/lib/utils'
import { message } from '@wind/wind-ui'

export const checkVIPReportExport = (onlySVIP?: boolean) => {
  const userVipInfo = getVipInfo()
  if (onlySVIP) {
    if (userVipInfo.isSvip) {
      return true
    }

    message.info('很抱歉，该功能仅SVIP用户可用。')
    return false
  }
  if (userVipInfo.isVip || userVipInfo.isSvip) {
    return true
  }
  message.info('很抱歉，该功能仅VIP/SVIP用户可用。')
  return false
}
export const sampleReportCorpDefault = {
  name: window.en_access_config ? 'Xiaomi Inc.' : '小米科技有限责任公司',
  id: '0A1047934153793',
}
