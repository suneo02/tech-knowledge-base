import { wftCommon } from '@/utils/utils.tsx'
import { DEFAULT_WSID } from '../constant/session'
import { wftCommonQueryStringObjs } from '../links/url'
import { cookieManager, sessionStorageManager } from '../storage'
import { isDev, isTerminalAppPath } from './misc'

export * from './baifen'
export * from './misc'

export interface IEnvParams {
  env?: TGelEnv
  isTerminal?: boolean
  isEnUS?: boolean
}

export type TGelEnv = 'terminal' | 'local' | /*gel web 端*/ 'web' | /*gel web 测试端*/ 'webTest' | 'terminalWeb' // 终端 从 web 访问， 测试部使用

export const getEnvParams = (): IEnvParams => {
  let env: TGelEnv = 'terminal'

  if (wftCommon.usedInClient()) {
    env = 'terminal'
  } else if (isTerminalAppPath()) {
    env = 'terminalWeb'
  } else if (wftCommon.isWebTest()) {
    env = 'webTest'
  } else if (wftCommon.isDevDebugger()) {
    env = 'local'
  } else {
    env = 'web'
  }

  return {
    env,
    isTerminal: env === 'terminal',
    isEnUS: !!window.en_access_config,
  }
}

/**
 * 获取是否是测试站
 */
export const isTestSite = () => {
  return window.location.host.indexOf('8.173') > -1 || window.location.host.indexOf('test.wind.') > -1
}

export const getWsid = () => {
  // 1. 优先从 query string 获取
  const qs = wftCommonQueryStringObjs()
  let wsid = qs['wind.sessionid']

  // 2. 其次从 cookie 获取
  if (!wsid) {
    wsid = cookieManager.get('wind.sessionid')
  }

  // 3. 其次从 sessionStorage 获取
  if (!wsid) {
    wsid = sessionStorageManager.get('GEL-wsid')
  }

  // 4. 再其次从 window.global_wsid 获取
  if (!wsid) {
    wsid = window.global_wsid
  }

  // 5. 非生产环境兜底 DEFAULT_WSID
  if (!wsid && isDev) {
    wsid = DEFAULT_WSID
  }

  return wsid || ''
}
