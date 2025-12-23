import { usedInClient } from '@/env'

// 风控平台外链生成，仅供外部链接使用
// 终端环境：走本地域名 origin 下的路径
// Web 环境：统一跳登录页（外网域名）

export enum RiskOutModule {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
}

const getTerminalRiskPath = () => '/wind.risk.platform/index.html#/check/special/judicature'
const getWebLoginUrl = () => 'https://erm.wind.com.cn/wind.risk.platform/index.html#/login'

export const getRiskOutUrl = (module: RiskOutModule): string => {
  // 暂不处理 module， 后续添加detail
  console.log('module', module)
  try {
    const isTerminalEnv = usedInClient() || /pc\.front/i.test(window.location?.href?.toLowerCase?.() || '')
    if (isTerminalEnv) {
      return new URL(getTerminalRiskPath(), window.location.origin).toString()
    }
    // Web 环境统一跳登录
    return getWebLoginUrl()
  } catch (e) {
    console.error('getRiskOutUrl error', e)
    return ''
  }
}
