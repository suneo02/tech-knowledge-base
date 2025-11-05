import { myWfcAjax } from '@/api/common.ts'
import { ApiResponse } from '@/api/types.ts'
import { getWsid } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import { message } from '@wind/wind-ui'
import { useState } from 'react'

export interface ICreateHKPayOrderRes {
  pcUrl: string
  mobileUrl: string
  orderId: string
}

export interface ICreatePayOrderPayload<T> {
  goodsId: 51579 //  商品 ID (枚举)
  count: number // 购买数量
  extraParmaJson: T // 额外参数
}

/**
 * 抽象的创建支付订单函数
 *
 *
 */
export const createPayOrder = async <T>(payload: ICreatePayOrderPayload<T>) => {
  // 需要将 extraParmaJson 转为 json 后端恶心的数据格式

  return await myWfcAjax<ICreateHKPayOrderRes, ICreatePayOrderPayload<string>>('operation/insert/createPayOrder', {
    ...payload,
    extraParmaJson: JSON.stringify(payload.extraParmaJson),
  })
}

export const useCreatePayOrder = <P>(
  apiCreatePayOrder: (param: P) => Promise<ApiResponse<ICreateHKPayOrderRes>>, // 创建支付订单的异步函数
  onSuccess?: () => void // 支付成功后的回调函数
) => {
  const usedInClient = wftCommon.usedInClient()
  const wsd = getWsid()

  const [loading, setLoading] = useState(false) // 用于指示加载状态
  const [data, setData] = useState<ICreateHKPayOrderRes | null>(null) // 用于存储订单数据
  const [success, setSuccess] = useState(false) // 用于指示订单创建成功

  const createPayOrder = async (param: P) => {
    setLoading(true)
    try {
      const res = await apiCreatePayOrder(param) // 调用创建支付订单的 API
      if (res.code === '200012') {
        message.info('权限正在开通中，请稍后刷新页面查看，请勿重复购买', 3)
        return
      }
      if (Number(res.code) !== 0) {
        // TODO code
        message.info('创建订单失败，请稍候重试' + (res.code ? res.code : '') + ('msg' in res ? res.msg : ''))
        return
      }
      setSuccess(true)
      if (res.Data) {
        setData(res.Data)
      }
      if (res.Data.pcUrl) {
        // 处理 PC URL
        let url: string
        if (usedInClient) {
          url = res.Data?.pcUrl
        } else {
          url = `${res.Data?.pcUrl?.replace('#/', '')}&wind.sessionid=${wsd}`
        }
        window.open(url)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        message.info('创建订单异常，请稍候重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试', error)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    createPayOrder,
    loading,
    orderData: data,
    success,
  }
}

export const getOrderPayStatus = (orderId: string) => {
  return myWfcAjax<
    {
      paid: boolean // 用户支付状态
      finish: boolean // 订单完成状态
    },
    {
      orderId: string
    }
  >('operation/get/getOrderPayStatus', { orderId })
}
