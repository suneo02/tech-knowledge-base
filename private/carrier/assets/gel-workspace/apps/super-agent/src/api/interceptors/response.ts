// intl done
import { message } from '@wind/wind-ui'
import { AxiosError, type AxiosResponse } from 'axios'
import {
  ApiCodeForIndicator,
  ApiCodeForWfc,
  type ApiResponseForChat,
  type ApiResponseForIndicator,
  type ApiResponseForTable,
  type ApiResponseForWFC,
  type KnownError,
} from 'gel-api'
import { ERROR_TEXT } from 'gel-util/config'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/intl'
import { handleAxiosError } from '../error/error-handling'
// const safeJsonParse = <T = any>(text: string): T | null => {
//   try {
//     return JSON.parse(text) as T
//   } catch {
//     return null
//   }
// }
const STRINGS = {
  INSUFFICIENT_POINTS_SVIP: t('464192', '积分不足，如需更多积分，请联系客户经理~'),
  INSUFFICIENT_POINTS_NORMAL: (operationPoints: string) =>
    t('464127', '当前积分不足，本次操作需要{{operationPoints}}，可购买 SVIP 享受每日赠送', {
      operationPoints,
    }),
  INSUFFICIENT_POINTS_BUY: t('464120', '去购买'),
  USE_OUT_LIMIT_GATEWAY: t('464098', '今天查询机会用完啦，明天再来试试吧~'),
  POINTS: t('465474', '积分'),
}

// const VIP_URL = usedInClient()
//   ? 'https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/Company/index.html?nosearch=1#/versionPrice'
//   : 'https://gel.wind.com.cn/web/Company/index.html?nosearch=1#/versionPrice'

// 针对积分不足的定制化处理
// const handleInsufficientPoints = () => {
//   const state = store.getState()
//   const { vipStatus } = state.user
//   const isSVIP = vipStatus === VipStatusEnum.SVIP

//   if (isSVIP) {
//     // SVIP 用户的处理逻辑
//     message.error(STRINGS.INSUFFICIENT_POINTS_SVIP)
//   } else {
//     // 普通及 VIP 用户的处理逻辑
//     // const userPoints = selectPointsCount(state)
//     // let operationPoints={t('', '0积分')}
//     // const parsedError = safeJsonParse<{ consumptionPoint?: number }>(errorMessage)
//     // if (parsedError?.consumptionPoint && parsedError.consumptionPoint > 0) {
//     //   operationPoints = parsedError.consumptionPoint.toLocaleString() + STRINGS.POINTS
//     // }
//     // else {
//     //   operationPoints = '0' + STRINGS.POINTS
//     // }
//     // const messageContent = STRINGS.INSUFFICIENT_POINTS_NORMAL(operationPoints)
//     // showMessage({
//     //   content: messageContent,
//     //   duration: 5,
//     //   showActionButton: true,
//     //   okText: STRINGS.INSUFFICIENT_POINTS_BUY,
//     //   onOk: () => window.open(VIP_URL),
//     // })
//   }
// }

// Type guard functions
function isIndicatorResponse(data: unknown): data is ApiResponseForIndicator<unknown> {
  return !!data && typeof data === 'object' && 'code' in data && 'msg' in data
}

function isWFCResponse(data: unknown): data is ApiResponseForWFC<unknown> {
  return !!data && typeof data === 'object' && 'ErrorCode' in data && 'ErrorMessage' in data
}

function isStandardResponse(data: unknown): data is ApiResponseForChat<unknown> {
  return !!data && typeof data === 'object' && 'status' in data && 'message' in data
}

export const responseInterceptor = (
  response: AxiosResponse<
    | ApiResponseForChat<unknown>
    | ApiResponseForWFC<unknown>
    | ApiResponseForIndicator<unknown>
    | ApiResponseForTable<unknown>
  >
) => {
  // 如果是流式请求，直接返回响应
  if (response.config.responseType === 'stream') {
    return response
  }

  // 处理普通请求
  const { data } = response

  if (isWFCResponse(data)) {
    // 统一转换为字符串，后端也不能保证返回类型
    ;(data as { ErrorCode: string }).ErrorCode = String(data.ErrorCode)
  }

  // Success conditions for different response types
  if (
    (isIndicatorResponse(data) && data.code === ApiCodeForIndicator.Success) ||
    (isWFCResponse(data) && data.ErrorCode === ApiCodeForWfc.SUCCESS) ||
    (isStandardResponse(data) && (data.status === '200' || data.status === '0'))
  ) {
    return response
  }

  // Error handling
  let errorCode = ''
  let errorMessage = ''

  if (isIndicatorResponse(data)) {
    errorCode = String(data.code)
    errorMessage = data.msg
  } else if (isWFCResponse(data)) {
    errorCode = String(data.ErrorCode)
    if (errorCode === '200001' || errorCode === '400011') {
      errorMessage = data.ErrorMessage || ''
    }
    // errorMessage = data.ErrorMessage
  } else if (isStandardResponse(data)) {
    errorCode = String(data.status)
    errorMessage = data.message || ''
  }

  // 针对积分不足的定制化处理
  if (errorCode === ApiCodeForWfc.INSUFFICIENT_POINTS) {
    // handleInsufficientPoints(errorCode, errorMessage)
    return Promise.reject(new Error(errorMessage))
  }

  if (errorCode === ApiCodeForWfc.USE_OUT_LIMIT_GATEWAY) {
    message.error(STRINGS.USE_OUT_LIMIT_GATEWAY)
    return Promise.reject()
  }

  if (errorCode === ApiCodeForWfc.INSERT_OUT_LIMIT) {
    message.error(ERROR_TEXT[errorCode])
    return Promise.reject()
  }

  if (errorCode !== '200001' && errorCode !== '400011') {
    errorMessage = ERROR_TEXT[errorCode] || errorMessage || ERROR_TEXT.DEFAULT
  }

  if (errorMessage) {
    message.error(errorMessage)
  }

  if (ERROR_TEXT[errorCode]) {
    // 如果错误码在ERROR_TEXT中，则返回错误信息
    const knownError: KnownError<unknown> = {
      errorCode,
      errorMessage,
      data,
    }
    return Promise.reject(knownError)
  }

  return Promise.reject(
    handleAxiosError(new AxiosError(errorMessage, errorCode, response.config, response.request, response))
  )
}

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 403) {
    if (!usedInClient() && process.env.NODE_ENV !== 'development') {
      localStorage.setItem('gelLastUrl', window.location.href)
      window.location.href = 'https://gel.wind.com.cn/web/windLogin.html?nosearch=1'
    }
    message.error(error.message)
    return Promise.reject(handleAxiosError(error))
  }
  return Promise.reject(handleAxiosError(error))
}
