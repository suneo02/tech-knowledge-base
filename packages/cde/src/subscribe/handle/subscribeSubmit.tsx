import { message } from 'antd'
import { ApiCodeForWfc, CDEAddSubscribePayload, CDESubscribeItem, CDEUpdateSubscribePayload } from 'gel-api'
import { intl } from 'gel-util/intl'
import { SubscriptionFormApi, SubscriptionFormData } from '../SubscriptionItemSetting'

interface SubscriptionServiceParams extends SubscriptionFormApi {
  formData: SubscriptionFormData
  /**
   * 保存时 只有superQueryLogic
   * 编辑时 有完整的CDESubscribeItem
   */
  info?:
    | (Pick<CDESubscribeItem, 'superQueryLogic'> & {
        subName?: string
      })
    | CDESubscribeItem
  onSuccess?: () => void
}

/**
 * 处理订阅创建和更新的服务函数
 */
export const handleSubscriptionSubmit = async ({
  formData,
  info,
  onSuccess,
  updateSubFunc,
  addSubFunc,
}: SubscriptionServiceParams) => {
  const { subscriptionName, isPushEnabled, isEmailEnabled, emailAddress } = formData

  // 构建基础参数
  const baseParams = {
    subName: subscriptionName,
    subPush: isPushEnabled && isEmailEnabled ? 1 : 0,
    ...(isPushEnabled && isEmailEnabled ? { mail: emailAddress } : {}),
  } as const

  try {
    if (info && 'id' in info) {
      // 更新订阅
      const updateParams: CDEUpdateSubscribePayload = {
        ...baseParams,
        id: info.id,
        superQueryLogic: info.superQueryLogic,
      }

      const res = await updateSubFunc(updateParams)
      if (res.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success(intl('', '更新成功'))
        onSuccess?.()
      }
    } else {
      // 新建订阅
      const addParams: CDEAddSubscribePayload = {
        ...baseParams,
        superQueryLogic: info?.superQueryLogic || '',
      }

      const res = await addSubFunc(addParams)
      if (res.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success(intl('', '创建成功'))
        onSuccess?.()
      }
    }
  } catch (error) {
    console.error('Subscription service error:', error)
    message.error(intl('', '操作失败，请重试'))
  }
}
