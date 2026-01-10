import { usedInClient } from '@/env'

// 风控平台外链生成，仅供外部链接使用
// 终端环境：走本地域名 origin 下的路径
// Web 环境：统一跳登录页（外网域名）

export enum RiskOutModule {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
  // 司法风险模块
  EQUITY_FREEZE = 'EQUITY_FREEZE', // 股权冻结
  EXIT_RESTRICTION = 'EXIT_RESTRICTION', // 限制出境
  REWARD_NOTICE = 'REWARD_NOTICE', // 悬赏公告
  // 经营风险模块
  BOND_DEFAULT = 'BOND_DEFAULT', // 债券违约
  NONSTANDARD_DEFAULT = 'NONSTANDARD_DEFAULT', // 非标违约
  DEBT_OVERDUE = 'DEBT_OVERDUE', // 债务逾期
  COMMERCIAL_OVERDUE = 'COMMERCIAL_OVERDUE', // 商票逾期
  ENVIRONMENTAL_CREDIT = 'ENVIRONMENTAL_CREDIT', // 环保信用
  EQUITY_PLEDGE = 'EQUITY_PLEDGE', // 股权质押
  SIMPLE_CANCELLATION = 'SIMPLE_CANCELLATION', // 简易注销
}

// 常量定义
const BASE_PATH_ENTERPRISE = '/check/enterprise'
const BASE_PATH_HOME = '/check/special/judicature'

// 风控模块路径配置
interface RiskModuleConfig {
  /** 基础路径 */
  basePath: string
  /** 是否需要企业代码 */
  requireCompanyCode: boolean
}

// 默认配置：大部分模块都需要企业代码
const DEFAULT_CONFIG: RiskModuleConfig = {
  basePath: BASE_PATH_ENTERPRISE,
  requireCompanyCode: true,
}

const RISK_MODULE_CONFIG: Record<RiskOutModule, RiskModuleConfig> = {
  [RiskOutModule.HOME]: {
    basePath: BASE_PATH_HOME,
    requireCompanyCode: false,
  },
  [RiskOutModule.DETAIL]: DEFAULT_CONFIG,
  // 司法风险模块
  [RiskOutModule.EQUITY_FREEZE]: DEFAULT_CONFIG,
  [RiskOutModule.EXIT_RESTRICTION]: DEFAULT_CONFIG,
  [RiskOutModule.REWARD_NOTICE]: DEFAULT_CONFIG,
  // 经营风险模块
  [RiskOutModule.BOND_DEFAULT]: DEFAULT_CONFIG,
  [RiskOutModule.NONSTANDARD_DEFAULT]: DEFAULT_CONFIG,
  [RiskOutModule.DEBT_OVERDUE]: DEFAULT_CONFIG,
  [RiskOutModule.COMMERCIAL_OVERDUE]: DEFAULT_CONFIG,
  [RiskOutModule.ENVIRONMENTAL_CREDIT]: DEFAULT_CONFIG,
  [RiskOutModule.EQUITY_PLEDGE]: DEFAULT_CONFIG,
  [RiskOutModule.SIMPLE_CANCELLATION]: DEFAULT_CONFIG,
}

// 模块子路径映射
const SUB_PATH_PREFIX = '/1'
const MODULE_SUB_PATHS: Partial<Record<RiskOutModule, string>> = {
  [RiskOutModule.DETAIL]: SUB_PATH_PREFIX,
  [RiskOutModule.EQUITY_FREEZE]: `${SUB_PATH_PREFIX}/ShareLockUpNew`,
  [RiskOutModule.EXIT_RESTRICTION]: `${SUB_PATH_PREFIX}/RestrictOutbound`,
  [RiskOutModule.REWARD_NOTICE]: `${SUB_PATH_PREFIX}/RewardAnnouncement`,
  [RiskOutModule.BOND_DEFAULT]: `${SUB_PATH_PREFIX}/BondDefault`,
  [RiskOutModule.NONSTANDARD_DEFAULT]: `${SUB_PATH_PREFIX}/NonStandardDefaul`,
  [RiskOutModule.DEBT_OVERDUE]: `${SUB_PATH_PREFIX}/OverdueDebt`,
  [RiskOutModule.COMMERCIAL_OVERDUE]: `${SUB_PATH_PREFIX}/OverdueCommercialTickets`,
  [RiskOutModule.ENVIRONMENTAL_CREDIT]: `${SUB_PATH_PREFIX}/Environmental`,
  [RiskOutModule.EQUITY_PLEDGE]: `${SUB_PATH_PREFIX}/OperatingRisk`,
  [RiskOutModule.SIMPLE_CANCELLATION]: `${SUB_PATH_PREFIX}/OperatingRisk`,
}

const getRiskModulePath = (module: RiskOutModule, companyCode?: string): string | undefined => {
  const config = RISK_MODULE_CONFIG[module]
  if (!config) {
    return RISK_MODULE_CONFIG[RiskOutModule.HOME].basePath
  }

  const { basePath, requireCompanyCode } = config

  // 如果需要企业代码但未提供，返回 undefined
  if (requireCompanyCode && !companyCode) {
    return undefined
  }

  // 构建完整路径
  let fullPath = basePath
  if (requireCompanyCode && companyCode) {
    fullPath += `/${companyCode}`
  }

  // 添加子路径
  const subPath = MODULE_SUB_PATHS[module]
  if (subPath) {
    fullPath += subPath
  }

  return fullPath
}

const getTerminalRiskPath = (module: RiskOutModule, companyCode?: string): string | undefined => {
  const path = getRiskModulePath(module, companyCode)
  if (!path) {
    return undefined
  }
  return `//riskwebserver/wind.risk.platform/index.html#${path}`
}

const getWebLoginUrl = () => 'https://erm.wind.com.cn/wind.risk.platform/index.html#/login'

/**
 * 获取风控平台外链
 * @param module 风控模块
 * @param companyCode 企业代码（某些模块必需）
 * @returns 风控平台链接，如果缺少必需参数则返回 undefined
 */
export const getRiskOutUrl = (module: RiskOutModule, companyCode?: string): string | undefined => {
  try {
    if (usedInClient()) {
      return getTerminalRiskPath(module, companyCode)
    }
    // Web 环境统一跳登录
    return getWebLoginUrl()
  } catch (e) {
    console.error('getRiskOutUrl error', e)
    return undefined
  }
}
