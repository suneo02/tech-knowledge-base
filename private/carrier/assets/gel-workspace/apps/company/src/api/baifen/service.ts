import { message } from '@wind/wind-ui'
import { BaifenCompApiCode, requestToBaifenCompWithAxios } from 'gel-api'
import { intl } from 'gel-util/intl'
import { baifenAxiosInstance } from './base'

export async function applyForTrialAndShowToast() {
  const res = await requestToBaifenCompWithAxios(baifenAxiosInstance, 'marketing/trial/apply')
  if (res.resultCode == BaifenCompApiCode.Success) {
    message.success(intl('480874', '专属客户经理已收到开通需求，将在一个工作日内同您联系'))
  }
}
