import { getCurrentEnv, getWsidProd, TGelEnv } from 'gel-util/env'
import { isEn } from 'gel-util/intl'
import { DEFAULT_WSID } from '../constant/session'
import { isDev } from './misc'
export type { TGelEnv } from 'gel-util/env'

export * from './baifen'
export * from './misc'

export interface IEnvParams {
  env?: TGelEnv
  isTerminal?: boolean
  isEnUS?: boolean
}

export const getEnvParams = (): IEnvParams => {
  let env: TGelEnv = getCurrentEnv(isDev)

  return {
    env,
    isTerminal: env === 'terminal',
    isEnUS: isEn(),
  }
}

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
