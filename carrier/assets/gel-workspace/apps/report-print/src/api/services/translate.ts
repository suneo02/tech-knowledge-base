import { isEnForRPPrint } from '@/utils/lang'
import { translateComplexHtmlData } from 'report-util/url'
import { RequestConfig } from '../types/request'
import { requestWfcSecure } from './wfcSecure'

const apiTranslateRaw = (data: any, options: Pick<RequestConfig, 'success' | 'error' | 'finish'>) => {
  if (!isEnForRPPrint() || !data) {
    options.success?.(data)
    options.finish?.(data)
    return
  }

  translateComplexHtmlData(
    data,
    (params, callback) => {
      requestWfcSecure('apitranslates', {
        params: {
          s: Math.random().toString(),
        },
        data: {
          transText: JSON.stringify(params),
          sourceLang: 1,
          targetLang: 2,
          source: 'gel',
        },
        success: (res) => {
          if (res.Data && typeof res.Data === 'object' && 'translateResult' in res.Data) {
            const translateResult = (res.Data as { translateResult: Record<string, string> }).translateResult
            callback(translateResult)
          } else {
            callback(null)
          }
        },
        error: () => {
          callback(null)
        },
      })
    },
    (result) => {
      options.success?.(result)
      options.finish?.(result)
    }
  )
}

const MAX_CONCURRENT_REQUESTS = 5
let activeRequests = 0
const requestQueue: Array<{ data: any; options: Pick<RequestConfig, 'success' | 'error' | 'finish'> }> = []

/**
 * 处理请求队列。
 * 该函数会检查当前活动的请求数量和队列中等待的请求。
 * 如果活动请求数未达到上限且队列不为空，则从队列中取出一个新请求并执行。
 */
function processQueue() {
  // 如果当前活动请求数已达到最大并发数，或者队列已空，则不执行任何操作。
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    return
  }

  // 从队列头部取出一个请求。使用非空断言(!)是因为我们已经检查过队列不为空。
  const { data, options } = requestQueue.shift()!

  // 活动请求数加一
  activeRequests++

  const { success, error, finish } = options

  // 调用原始的翻译接口
  apiTranslateRaw(data, {
    success,
    error,
    // 包装 `finish` 回调，以便在请求完成时执行额外操作
    finish: (result) => {
      // 调用原始的 `finish` 回调
      finish?.(result)
      // 请求完成后，活动请求数减一
      activeRequests--
      // 尝试处理队列中的下一个请求
      processQueue()
    },
  })
}

export const apiTranslate = (data: any, options: Pick<RequestConfig, 'success' | 'error' | 'finish'>) => {
  requestQueue.push({ data, options })
  processQueue()
}
