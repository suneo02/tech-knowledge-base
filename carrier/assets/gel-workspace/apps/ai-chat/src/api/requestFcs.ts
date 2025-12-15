import { ApiOptions, ApiPaths, GetApiData, SUPERLIST_API_PATH, WFC_API_PATH, WIND_ENT_CHAT_PATH } from 'gel-api'
import { requestAuto } from '.'

/**
 *
 * TODO 上线前需删除
 * request to ent chat
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options 其他选项(method, appendUrl等)
 * @returns 响应数据的Promise
 *
 */
export function requestToChatFcs<P extends keyof ApiPaths[typeof WIND_ENT_CHAT_PATH]>(
  api: P,
  data?: GetApiData<typeof WIND_ENT_CHAT_PATH, P>,
  options: Omit<ApiOptions<typeof WIND_ENT_CHAT_PATH, P>, 'server'> = {}
) {
  return requestAuto<typeof WIND_ENT_CHAT_PATH, P>(api, {
    server: WIND_ENT_CHAT_PATH,
    data,
    ...options,
  })
}

/**
 *
 * TODO 上线前需删除
 * request to ent chat superlist
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options 其他选项(method, appendUrl等)
 * @returns 响应数据的Promise
 *
 */
export function requestToSuperlistFcs<P extends keyof ApiPaths[typeof SUPERLIST_API_PATH]>(
  api: P,
  data?: GetApiData<typeof SUPERLIST_API_PATH, P>,
  options: Omit<ApiOptions<typeof SUPERLIST_API_PATH, P>, 'server'> = {}
) {
  return requestAuto<typeof SUPERLIST_API_PATH, P>(api, {
    server: SUPERLIST_API_PATH,
    data,
    ...options,
  })
}

/**
 *
 * TODO 上线前需删除
 * request to ent chat superlist
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options 其他选项(method, appendUrl等)
 * @returns 响应数据的Promise
 *
 */
export function requestToDownloadFcs<P extends keyof ApiPaths[typeof WFC_API_PATH]>(
  api: P,
  data?: GetApiData<typeof WFC_API_PATH, P>,
  options: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'> = {}
) {
  return requestAuto<typeof WFC_API_PATH, P>(api, {
    server: WFC_API_PATH,
    data,
    ...options,
  })
}

/**
 *
 * TODO 上线前需删除
 * request to ent chat superlist
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options 其他选项(method, appendUrl等)
 * @returns 响应数据的Promise
 *
 */
export function requestToWFCSuperlistFcs<P extends keyof ApiPaths[typeof WFC_API_PATH]>(
  api: P,
  data?: GetApiData<typeof WFC_API_PATH, P>,
  options: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'> & { signal?: AbortSignal } = {}
) {
  return requestAuto<typeof WFC_API_PATH, P>(api, {
    server: WFC_API_PATH,
    data,
    ...options,
  })
}
