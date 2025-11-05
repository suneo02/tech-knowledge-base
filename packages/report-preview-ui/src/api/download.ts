import { message } from '@wind/wind-ui'
import { ApiResponseForWFC } from 'gel-api'
import { t } from 'gel-util/intl'
import { generateUrlByModule, LinkModule, UserLinkParamEnum } from 'gel-util/link'

export const handleDownloadReport = (res: ApiResponseForWFC) => {
  if (res.ErrorCode == '0') {
    const downloadUrl = generateUrlByModule({
      module: LinkModule.USER_CENTER,
      params: {
        type: UserLinkParamEnum.MyData,
      },
    })
    window.open(downloadUrl)
    return
  }
  if (res.ErrorCode == '-10') {
    message.error('购买SVIP套餐，每日最多可导出10份尽职调查报告')
    return
  }
  if (res.ErrorCode == '-9') {
    message.error('您今日尽职调查报告导出的额度已用完。')
    //超限
    return
  }
  message.error(t('204684', '导出出错'))
}
