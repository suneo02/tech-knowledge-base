import { getWsidProd } from 'gel-util/env'
import { DEFAULT_WSID } from '../constant/session'
import { isDev } from './misc'
export type { TGelEnv } from 'gel-util/env'

export * from './misc'

/**
 * 获取是否是测试站
 */
export const isTestSite = () => {
  return window.location.host.indexOf('8.173') > -1 || window.location.host.indexOf('test.wind.') > -1
}

export const getWsid = () => {
  let wsid = getWsidProd()
  // 非生产环境兜底 DEFAULT_WSID
  if (!wsid && isDev) {
    wsid = DEFAULT_WSID
  }

  return wsid || ''
}
