import { getUrlSearchValue } from '@/common'
import { getCurrentEnv, usedInClient } from '@/env'
import { HTTPS_Protocol } from '../constant'

/**
 * 是否来自 Rime 旧项目
 * @returns {boolean}
 */
export const isFromRime = () => {
  const linksource = getUrlSearchValue('linksource')
  return linksource === 'rime'
}

/**
 * 是否来自 Rime PEVC rime lite新项目
 * @returns {boolean}
 */
export const isFromRimePEVC = () => {
  const linksource = getUrlSearchValue('linksource')
  return linksource === 'rimepevc'
}

const getRimeHostMap = (isDev?: boolean) => {
  const env = getCurrentEnv(isDev ?? false)
  return {
    terminal: 'RIME', // 终端中
    web: env === 'web' || env === 'webTest' || isDev ? 'rimedata.com' : location.host, // web 地址 2025.01.06 by 熊威，要求不用写死的域名，且对方保证企业库页面在rime同域
  }
}

export enum RimeTargetType {
  COMPANY = 'ORGANIZATION', // rime 企业
  PERSON = 'PERSON', // rime 人物
  /** @deprecated */
  VERTICAL = 'VERTICAL', // rime 来觅赛道 added by Calvin
  /** @deprecated */
  VERTICAL_HOME = 'VERTICAL_HOME', // rime 来觅赛道首页 added by Calvin
}

export const getRimeHost = (isDev?: boolean) =>
  usedInClient() ? getRimeHostMap(isDev).terminal : getRimeHostMap(isDev).web

export enum RimeLinkModule {
  PEVC_EVENT, // 一级市场投融数据
  VERTICAL_ALL, // 一级市场来觅赛道首页
  PEVC_FUND, // 私募股权基金
  PEVC_INSTITUTION, // 投资机构
  GOV_FUNDED_PLATFORM_INSTITUTION, // 政府出资平台
  BP_ANALYSIS, // AI 商业计划书分析
  PROFILE, // 档案页（企业/人物）
}

export const RimeLinkConfigMap: Record<
  RimeLinkModule,
  {
    terminalPath: string
    webPath: string
    defaultParamsTerminal?: Record<string, string>
    defaultParamsWeb?: Record<string, string>
  }
> = {
  [RimeLinkModule.PEVC_EVENT]: {
    terminalPath: '/rime/frontend/web/database/realm/pevc.event',
    webPath: '/database/realm/pevc.event',
    defaultParamsTerminal: { from: '/database/realm/pevc.aboard_deal' },
    defaultParamsWeb: { from: '/database/realm/pevc.event' },
  },
  [RimeLinkModule.VERTICAL_ALL]: {
    terminalPath: '/rime/frontend/web/vertical/all',
    webPath: '/vertical/all',
    defaultParamsTerminal: { from: '/vertical/industry-tree' },
    defaultParamsWeb: { from: '/' },
  },
  [RimeLinkModule.PEVC_FUND]: {
    terminalPath: '/rime/frontend/web/database/realm/pevc.fund',
    webPath: '/database/realm/pevc.fund',
    defaultParamsTerminal: { from: '/database/realm/pevc.fund' },
    defaultParamsWeb: { from: '/database/realm/pevc.event' },
  },
  [RimeLinkModule.PEVC_INSTITUTION]: {
    terminalPath: '/rime/frontend/web/database/realm/pevc.institution',
    webPath: '/database/realm/pevc.institution',
    defaultParamsTerminal: { from: '/database/realm/pevc.event' },
    defaultParamsWeb: { from: '/database/realm/pevc.fund' },
  },
  [RimeLinkModule.GOV_FUNDED_PLATFORM_INSTITUTION]: {
    terminalPath: '/rime/frontend/web/database/realm/pevc.gov_funded_platform_institution',
    webPath: '/database/realm/pevc.gov_funded_platform_institution',
    defaultParamsTerminal: { from: '/database/realm/pevc.institution' },
    defaultParamsWeb: { from: '/database/realm/pevc.lp' },
  },
  [RimeLinkModule.BP_ANALYSIS]: {
    terminalPath: '/rime/frontend/web/workbench/ai-lab/bp-analysis',
    webPath: '/workbench/ai-lab/bp-analysis',
    defaultParamsTerminal: { from: '/database/realm/pevc.aboard_deal' },
    defaultParamsWeb: { from: '/institution' },
  },
  [RimeLinkModule.PROFILE]: {
    terminalPath: '/rime/frontend/web/profile',
    webPath: '/profile',
    defaultParamsTerminal: { id: '', type: RimeTargetType.COMPANY },
    defaultParamsWeb: { id: '', type: RimeTargetType.COMPANY },
  },
}

export interface RimeLinkParams {
  [RimeLinkModule.PEVC_EVENT]: { from?: string }
  [RimeLinkModule.VERTICAL_ALL]: { from?: string }
  [RimeLinkModule.PEVC_FUND]: { from?: string }
  [RimeLinkModule.PEVC_INSTITUTION]: { from?: string }
  [RimeLinkModule.GOV_FUNDED_PLATFORM_INSTITUTION]: { from?: string }
  [RimeLinkModule.BP_ANALYSIS]: { from?: string }
  [RimeLinkModule.PROFILE]: { id?: string; type?: RimeTargetType }
}

export const getRimeLink = (
  module: RimeLinkModule,
  params: RimeLinkParams[RimeLinkModule] = {},
  isDev?: boolean
): string => {
  const hostname = getRimeHost(isDev)
  const origin = `${HTTPS_Protocol}//${hostname}`
  const config = RimeLinkConfigMap[module]
  const path = usedInClient() ? config.terminalPath : config.webPath
  const url = new URL(path, origin)
  const merged = {
    ...(usedInClient() ? config.defaultParamsTerminal || {} : config.defaultParamsWeb || {}),
    ...(params || {}),
  }
  url.search = new URLSearchParams(merged).toString()
  return url.toString()
}

/** @deprecated 请改用 getRimeLink(RimeLinkModule.PROFILE) */
export const getRimeOrganizationUrl = ({ id, type }: { id?: string; type?: RimeTargetType }) => {
  if (type === RimeTargetType.VERTICAL_HOME) {
    return getRimeLink(RimeLinkModule.VERTICAL_ALL, {})
  }
  return getRimeLink(RimeLinkModule.PROFILE, { id: id || '', type: type || RimeTargetType.COMPANY })
}
