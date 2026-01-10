import { loaclDevManager } from 'gel-ui'
export { isWebTest, usedInClient } from 'gel-util/env'

export const NODE_ENV = process.env.NODE_ENV
export const DEPLOY_TARGET = process.env.DEPLOY_TARGET

export const isDev = NODE_ENV === 'development'

export const isStaging = DEPLOY_TARGET === 'staging'

// 是否开发模式、还是生产模式
export const isDevDebugger = () => {
  return isDev
}

// 是否终端内使用

export const getApiPrefix = () => {
  let apiDevPrefix = loaclDevManager.get('GEL_API_PREFIX_DEV')
  if ((isDev || isStaging) && apiDevPrefix) {
    return apiDevPrefix
  }
  return ''
}

/**
 * 判断是否是终端 应用 路径
 */
export const isTerminalAppPath = () => {
  const loc = window.location.href?.toLocaleLowerCase() || ''
  return /pc\.front/i.test(loc)
}
