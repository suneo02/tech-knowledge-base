import { AxiosError } from 'axios'

// 错误日志记录函数类型
type ErrorLoggerFunction = (error: Error | AxiosError) => void

// 默认的错误日志记录器
let errorLogger: ErrorLoggerFunction = (error) => {
  console.error('api error', error)
}

// 设置错误日志记录器
export const setErrorLogger = (logger: ErrorLoggerFunction) => {
  errorLogger = logger
}

// 自定义API错误类
export class ApiError extends Error {
  public code: number
  public status?: number
  public path?: string
  public requestConfig?: unknown

  constructor(message: string, code: number, status?: number, path?: string, requestConfig?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.path = path
    this.requestConfig = requestConfig
  }
}

// 处理 Axios 错误
export const handleAxiosError = (error: AxiosError): ApiError => {
  if (error.response) {
    const { status, data } = error.response as { status: number; data?: unknown }
    if (status !== 404) {
      errorLogger(error)
    }
    let message = 'Server Error'
    let codeNum = status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = data
    if (d !== undefined) {
      if (typeof d === 'string') {
        message = d
      } else {
        const codeLike = d?.code ?? d?.ErrorCode ?? d?.status
        if (codeLike !== undefined) {
          const n = Number(codeLike)
          codeNum = Number.isNaN(n) ? status : n
        }

        let msg
        if (codeNum === 200001 && d?.ErrorMessage) {
          msg = d.ErrorMessage
        } else {
          msg = d?.msg ?? d?.ErrorMessage ?? d?.message
        }

        if (msg) {
          message = String(msg)
        }
      }
    }
    return new ApiError(message, codeNum, status, error.config?.url, {
      params: error.config?.params,
      data: error.config?.data,
      method: error.config?.method,
      url: error.config?.url,
    })
  } else if (error.request) {
    return new ApiError('Network Error - No response received', 0, undefined, undefined, error.config)
  } else {
    const codeNum = Number(error.code)
    const finalCode = Number.isNaN(codeNum) ? 0 : codeNum
    return new ApiError(error.message || 'Request Configuration Error', finalCode, undefined, undefined, error.config)
  }
}

// 错误消息格式化
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.code === 400011) {
      return error.message
    }
    return `[${error.code}] ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// 统一错误处理
export const errorHandler = (error: unknown) => {
  const errorMessage = formatErrorMessage(error)

  // 这里可以集成你的消息通知系统，比如 Ant Design 的 message
  console.error(errorMessage)

  // 可以根据不同的错误码进行不同的处理
  if (error instanceof ApiError) {
    // console.log('🚀 ~ errorHandler ~ error:', error)
    switch (error.code) {
      case 401:
        // 处理未授权
        break
      case 403:
        // 处理禁止访问
        break
      case 404:
        // 处理资源未找到
        break
      case 500:
        // 处理服务器错误
        break
      default:
        // 处理其他错误
        break
    }
  }

  return Promise.reject(error)
}
