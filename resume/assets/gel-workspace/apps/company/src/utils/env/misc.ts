export const NODE_ENV = process.env.NODE_ENV

export const isDev = NODE_ENV === 'development'

// 是否开发模式、还是生产模式
export const isDevDebugger = () => {
  return isDev
}

/**
 * 是否是 prod 环境
 * @returns
 */
export const isProd = () => {
  return NODE_ENV === 'production'
}

// 是否终端内使用
export const usedInClient = () => {
  if (window.external && window.external.ClientFunc) {
    return true
  }
  return false
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
