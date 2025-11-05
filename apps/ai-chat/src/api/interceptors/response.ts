import { KnownError } from '../types/response'
import { message } from 'antd'
import { AxiosError, AxiosResponse } from 'axios'
import {
  ApiCodeForIndicator,
  ApiCodeForWfc,
  ApiResponseForChat,
  ApiResponseForIndicator,
  ApiResponseForWFC,
} from 'gel-api'
import { handleAxiosError } from '../error/error-handling'
import { ERROR_TEXT } from '../error/errorCode'
import { ApiResponseForTable } from '../types/response'
import { t } from 'gel-util/intl'

// Type guard functions
function isIndicatorResponse(data: any): data is ApiResponseForIndicator<any> {
  return 'code' in data && 'msg' in data
}

function isWFCResponse(data: any): data is ApiResponseForWFC<any> {
  return 'ErrorCode' in data && 'ErrorMessage' in data
}

function isStandardResponse(data: any): data is ApiResponseForChat<any> {
  return 'status' in data && 'message' in data
}

export const responseInterceptor = (
  response: AxiosResponse<
    ApiResponseForChat<any> | ApiResponseForWFC<any> | ApiResponseForIndicator<any> | ApiResponseForTable<any>
  >
) => {
  // 如果是流式请求，直接返回响应
  if (response.config.responseType === 'stream') {
    return response
  }

  // 处理普通请求
  const { data } = response

  if ('ErrorCode' in data) {
    // 统一转换为字符串，后端也不能保证返回类型
    data.ErrorCode = String(data.ErrorCode)
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
    errorMessage = data.ErrorMessage
  } else if (isStandardResponse(data)) {
    errorCode = String(data.status)
    errorMessage = data.message
  }
  if (errorCode === ApiCodeForWfc.INSUFFICIENT_POINTS) {
    const message = JSON.parse(errorMessage) ?? errorMessage
    if (message?.consumptionPoint || message?.residualPoint) {
      errorMessage = t('', ERROR_TEXT[errorCode], {
        consumptionPoint: message.consumptionPoint || 0,
        residualPoint: message.residualPoint || 0,
      })
      Modal.warning({
        title: '提示',
        content: errorMessage,
      })
    } else {
      errorMessage = ERROR_TEXT[errorCode] || errorMessage || ERROR_TEXT.DEFAULT
      if (errorMessage) {
        message.error(errorMessage)
      }
    }
  } else {
    errorMessage = ERROR_TEXT[errorCode] || errorMessage || ERROR_TEXT.DEFAULT
    if (errorMessage) {
      message.error(errorMessage)
    }
  }

  if (ERROR_TEXT[errorCode]) {
    // 如果错误码在ERROR_TEXT中，则返回错误信息
    const knownError: KnownError<any> = {
      errorCode,
      errorMessage,
      data,
    }
    return Promise.reject(knownError)
  }

  return Promise.reject(handleAxiosError(new AxiosError(errorMessage, errorCode)))
}

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 403) {
    message.error(error.message)
  }
  return Promise.reject(handleAxiosError(error))
}
