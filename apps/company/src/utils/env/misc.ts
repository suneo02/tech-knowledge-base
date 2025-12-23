import { loaclDevManager } from 'gel-ui'

export const NODE_ENV = process.env.NODE_ENV
export const DEPLOY_TARGET = process.env.DEPLOY_TARGET

export const isDev = NODE_ENV === 'development'

export const isStaging = DEPLOY_TARGET === 'staging'

// 是否开发模式、还是生产模式
export const isDevDebugger = () => {
  return isDev
}

// 是否终端内使用
export const usedInClient = () => {
  if (window.external && window.external.ClientFunc) {
    return true
  }
  return false
}

export const getApiPrefix = () => {
  let apiDevPrefix = loaclDevManager.get('GEL_API_PREFIX_DEV')
  if ((isDev || isStaging) && apiDevPrefix) {
    return apiDevPrefix
  }
  return ''
}

// 是否是独立web测试站
export const isWebTest = () => {
  const loc = window.location.href?.toLocaleLowerCase() || ''
  return loc.indexOf('/wind.ent.web/gel') > -1
}

/**
 * 判断是否是终端 应用 路径
 */
export const isTerminalAppPath = () => {
  const loc = window.location.href?.toLocaleLowerCase() || ''
  return /pc\.front/i.test(loc)
}
