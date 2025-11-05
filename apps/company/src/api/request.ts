import { hashParams } from '@/utils/links'
import axios from './index.ts'
import type { ApiOptions, ApiPath, GetApiResponse, StreamApiOptions } from './types'

// API URLs
export const WIND_CHAT_URL = '/wind.ent.chat/api/'
export const SERVER_URL = '/Wind.WFC.Enterprise.Web/Enterprise/gel/'
export const SERVER_URL_OLD = '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx'
export const ACTION_URL_OLD = '?cmd='

/**
 * 智能API请求函数
 * @param api - API路径(自动补全)
 * @param options - API选项
 * @returns Promise<ApiResponse>
 */
export function request<T extends ApiPath>(api: T, options: ApiOptions<T> = {}): Promise<GetApiResponse<T>> {
  const { getAllParams, getParamValue } = hashParams()
  const { params = {}, noExtra = false, noHashParams = false, matchOldData = false } = options

  // 确定服务器URL和action URL
  const serverUrl = options.serverUrl ?? (matchOldData ? SERVER_URL_OLD : SERVER_URL)
  const actionUrl = matchOldData ? ACTION_URL_OLD : ''

  // 构建URL
  let url = `${serverUrl}${actionUrl}${api}`

  // 只有新接口且不禁用额外参数时才添加ID
  if (!matchOldData && !noExtra) {
    const id = options.id || getParamValue('groupId') || getParamValue('companycode') || getParamValue('id')
    if (id) {
      url = `${url}/${id}`
    }
  }

  // 处理url中的双斜杠
  url = url.replace(/gel\/\/download/g, 'gel/download')

  // 合并参数
  const data = noHashParams ? params : { ...getAllParams(), ...params }

  return axios.request({
    url,
    method: 'post',
    data,
    formType: options.formType,
  })
}

/**
 * 流式数据API请求函数 - 使用 axios 实现，专为 SSE 格式数据优化
 * @param api - API路径(自动补全)
 * @param options - 流式API选项，包含onStreamData回调
 * @returns Promise<void> - 流式API不返回完整响应，而是通过回调处理数据
 */
export function requestStream<T extends ApiPath>(api: T, options: StreamApiOptions<T>): Promise<void> {
  const { getAllParams, getParamValue } = hashParams()
  const {
    params = {},
    noExtra = false,
    noHashParams = false,
    matchOldData = false,
    formType,
    onStreamData,
    onError,
    onComplete,
  } = options

  return new Promise((resolve, reject) => {
    try {
      // 确定服务器URL和action URL
      const serverUrl = options.serverUrl ?? (matchOldData ? SERVER_URL_OLD : SERVER_URL)
      const actionUrl = matchOldData ? ACTION_URL_OLD : ''

      // 构建URL
      let url = `${serverUrl}${actionUrl}${api}`

      // 只有新接口且不禁用额外参数时才添加ID
      if (!matchOldData && !noExtra) {
        const id = options.id || getParamValue('groupId') || getParamValue('companycode') || getParamValue('id')
        if (id) {
          url = `${url}/${id}`
        }
      }

      // 处理url中的双斜杠
      url = url.replace(/gel\/\/download/g, 'gel/download')

      // 合并参数
      const data = noHashParams ? params : { ...getAllParams(), ...params }

      // 用于缓存不完整的行
      let buffer = ''

      // 使用 axios 处理流式响应
      axios
        .request({
          url,
          method: 'post',
          data,
          formType,
          responseType: 'text', // 使用文本响应类型
          transformResponse: [(data) => data], // 禁用自动 JSON 解析
          // 配置一个较长的超时时间，因为流式响应可能持续较长时间
          timeout: 60000, // 60秒
          // 开启流式处理
          onDownloadProgress: function (progressEvent) {
            if (progressEvent.currentTarget instanceof XMLHttpRequest) {
              const xhr = progressEvent.currentTarget

              // 检查是否有新数据可用
              if (xhr.responseText) {
                // 计算新的文本内容
                const prevLength = (xhr as any)._prevLength || 0
                const newText = xhr.responseText.substring(prevLength)

                // 更新已处理的长度
                ;(xhr as any)._prevLength = xhr.responseText.length

                if (newText && newText.length > 0) {
                  // 处理可能不完整的行
                  buffer += newText

                  // 查找完整的行（以换行符分隔）
                  const lines = buffer.split('\n')

                  // 保留最后一行（可能不完整）作为下次的缓冲区
                  buffer = lines.pop() || ''

                  // 处理完整的行
                  if (lines.length > 0) {
                    const chunk = lines.join('\n')
                    // 调用回调处理数据块
                    onStreamData && onStreamData(chunk)
                  }
                }
              }
            }
          },
        })
        .then(() => {
          // 处理缓冲区中可能剩余的数据
          if (buffer.trim() && onStreamData) {
            onStreamData(buffer)
          }
          onComplete && onComplete()
          resolve()
        })
        .catch((error) => {
          onError && onError(error)
          reject(error)
        })
    } catch (error) {
      onError && onError(error)
      reject(error)
    }
  })
}

/**
 * 创建API请求函数
 * @template T - API路径类型
 * @param {Partial<ApiOptions<any>>} defaultOptions - 默认选项，会与传入的options合并
 * @param {object} [defaultOptions.params] - 默认参数对象
 * @param {boolean} [defaultOptions.noExtra] - 是否禁用额外参数（如ID）
 * @param {boolean} [defaultOptions.noHashParams] - 是否禁用URL哈希参数
 * @param {boolean} [defaultOptions.matchOldData] - 是否使用旧版数据格式
 * @param {string} [defaultOptions.serverUrl] - 自定义服务器URL
 * @param {string} [defaultOptions.id] - 自定义ID参数
 * @param {string} [defaultOptions.formType] - 表单类型
 * @returns {function} 返回一个请求函数，该函数接受API路径和选项参数
 * @returns {function} 返回的函数参数:
 *   - {T} api - API路径
 *   - {ApiOptions<T>} [options] - 请求选项，会与defaultOptions合并
 *   - {object} [options.params] - 请求参数
 *   - {boolean} [options.noExtra] - 是否禁用额外参数
 *   - {boolean} [options.noHashParams] - 是否禁用URL哈希参数
 *   - {boolean} [options.matchOldData] - 是否使用旧版数据格式
 *   - {string} [options.serverUrl] - 自定义服务器URL
 *   - {string} [options.id] - 自定义ID参数
 *   - {string} [options.formType] - 表单类型
 * @returns {Promise<GetApiResponse<T>>} 返回Promise，包含API响应数据
 *
 * @example
 * ```typescript
 * // 创建一个带有默认参数的请求函数
 * const apiRequest = createRequest({
 *   params: { token: 'default-token' },
 *   noExtra: false
 * });
 *
 * // 使用创建的请求函数
 * const response = await apiRequest('user/profile', {
 *   params: { userId: 123 }
 * });
 * ```
 */
export function createRequest(defaultOptions: Partial<ApiOptions<any>> = {}) {
  return function <T extends ApiPath>(api: T, options: ApiOptions<T> = {}): Promise<GetApiResponse<T>> {
    return request(api, {
      ...defaultOptions,
      ...options,
      params: {
        ...defaultOptions.params,
        ...options.params,
      },
    })
  }
}

/**
 * 创建流式API请求函数
 * @param defaultOptions - 默认选项
 * @returns 流式请求函数
 */
export function createStreamRequest(defaultOptions: Partial<StreamApiOptions<any>> = {}) {
  return function <T extends ApiPath>(api: T, options: StreamApiOptions<T> = {}): Promise<void> {
    return requestStream(api, {
      ...defaultOptions,
      ...options,
      params: {
        ...defaultOptions.params,
        ...options.params,
      },
    })
  }
}
