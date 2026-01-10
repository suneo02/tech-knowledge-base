import { getCurrentEnv, getWsidProd, usedInClient } from '@/env'
import qs from 'qs'
import { WX_WIND_HOST } from '../constant'

export const BaiFenPathConstants = {
  govbusiness: '/govbusiness',
  baifenweb: '/baifenweb',
  govmap: '/govmap/index.html',
  // 百分业务路径
  myenterpriseDownload: '/govbusiness/#/myenterprise/download',
  dashboardBusiness: '/govbusiness/#/dashboard/business0',
  webHome: '/govbusiness/#/web-home',
  superSearchFilter: '/govbusiness/#/super-search/filter',
  reportAnalysis: '/govbusiness/#/report-analysis',
  reportAnalysisProcessForGelBase: '/govbusiness',
  reportAnalysisProcessForGelHash: '#/report-analysis/process-for-gel',
  corpInfo: '/govbusiness/?{query}#/corpInfo',
  webMarket: '/govbusiness/#/web-market/{marketId}',
  authDesc: '/govbusiness/#/auth-desc',
} as const

/**
 * 百分环境配置选项
 */
export interface BaiFenEnvOptions {
  /** 是否为开发环境 */
  isDev?: boolean
  /** 是否为预发环境 */
  isStaging?: boolean
}

export const getBaiFenHostMap = (options?: Pick<BaiFenEnvOptions, 'isDev' | 'isStaging'>) => {
  const { isDev, isStaging } = options ?? {}
  const env = getCurrentEnv(isDev ?? false)
  return {
    terminal: 'govwebsite', // 终端中
    // 如果在 gel 环境， 使用 wx.wind.com.cn 地址， 否则使用 当前 host 地址
    web: !isStaging && (env === 'web' || isDev) ? WX_WIND_HOST : window.location.host, // web 地址
  }
}

export const getBaiFenHost = (options?: BaiFenEnvOptions) => {
  const { isDev, isStaging } = options || {}
  const isTerminal = usedInClient()
  const hostMap = getBaiFenHostMap({ isDev, isStaging })
  return isTerminal ? hostMap.terminal : hostMap.web
}

// 生成百分基础URL - 内部辅助函数
const buildBaiFenBaseUrl = (host: string) => {
  const protocol = window.location.protocol
  return `${protocol}//${host}`
}

// 生成百分市场URL - 内部辅助函数
const buildBaiFenMarketUrl = (host: string, marketId: string) =>
  `${buildBaiFenBaseUrl(host)}${BaiFenPathConstants.webMarket.replace('{marketId}', marketId)}`

// 生成百分企业官网登录页URL - 内部辅助函数
const buildBaiFenWebLoginUrl = (host: string) => `${buildBaiFenBaseUrl(host)}${BaiFenPathConstants.baifenweb}/`

export interface FinancingDetailsParams {
  companyId: string
  corpId: string
  title?: string
}

/**
 * 财报分析流程参数接口
 */
export interface ReportAnalysisProcessParams {
  /** 报告ID */
  id: string
}

// 生成百分融资详情URL - 内部辅助函数
const buildBaiFenFinancingDetailsUrl = (host: string, params: FinancingDetailsParams) => {
  const { companyId, corpId, title } = params
  const queryParams = new URLSearchParams()
  queryParams.append('companyId', companyId)
  queryParams.append('corpId', corpId)
  if (title) {
    queryParams.append('title', encodeURIComponent(title))
  }
  return `${buildBaiFenBaseUrl(host)}${BaiFenPathConstants.corpInfo.replace('{query}', queryParams.toString())}`
}

// 生成百分财报分析流程URL - 智能财报诊断功能
const buildBaiFenReportAnalysisUrl = (host: string, params: ReportAnalysisProcessParams) => {
  const { id } = params
  const queryParams = new URLSearchParams()
  queryParams.append('id', id)

  /**
   * ⚠️ 重要：这里必须在 query string 前加上 '/'
   *
   * 虽然标准 URL 格式是 /path?query#hash，不应该是 /path/?query#hash
   * 但由于终端环境的路由解析机制限制，必须使用 /govbusiness/?id=xxx 格式
   * 否则终端环境无法正确识别和跳转该 URL
   *
   * 正确格式（终端要求）：https://example.com/govbusiness/?id=123#/report-analysis/process-for-gel
   * 错误格式（标准但终端不支持）：https://example.com/govbusiness?id=123#/report-analysis/process-for-gel
   *
   * 此处的 '/' 是为了适配终端环境的特殊要求，请勿删除！
   */
  return `${buildBaiFenBaseUrl(host)}${BaiFenPathConstants.reportAnalysisProcessForGelBase}/?${queryParams.toString()}${BaiFenPathConstants.reportAnalysisProcessForGelHash}`
}

/**
 * 地图URL参数接口定义
 */
export interface MapUrlParams {
  mode?: string | number
  pureMode?: boolean
  title?: string
  right?: string
  companyId?: string
  addressType?: string
  'wind.sessionid'?: string
  [key: string]: any
}

/**
 * 构建地图URL
 * @param corpId 公司ID
 * @param isBusinessAddress 是否为办公地址
 * @param sessionId 可选的会话ID
 * @param isClient 是否在客户端环境中使用
 * @returns 格式化后的URL
 */
/**
 * getGovMapUrl函数的参数接口
 */
export interface BuildMapUrlOptions {
  /** 公司ID */
  corpId?: string
  /** 是否为业务地址 */
  isBusinessAddress?: boolean
}

/**
 * 构建百分万寻地图URL - 用于展示企业地理位置信息
 */
export const buildBaiFenMapUrl = (options: BuildMapUrlOptions): string => {
  const { corpId, isBusinessAddress } = options
  const isClient = usedInClient()

  // 使用BaiFenHost获取正确的主机名
  const host = getBaiFenHost()

  // 构建基础URL（使用当前环境的协议）
  const protocol = window.location.protocol
  const baseUrl = `${protocol}//${host}${BaiFenPathConstants.govmap}`

  // 构建参数对象
  const params: MapUrlParams = {
    mode: 2,
    pureMode: true,
    title: '万寻地图',
    right: '4C203DE15',
  }

  if (corpId) {
    params.companyId = corpId
  }

  // 有条件地添加参数
  if (isBusinessAddress) {
    params.addressType = 'businessAddress'
    params['1'] = '1' // 保留原有的特殊参数
  }

  if (!isClient) {
    const sessionId = getWsidProd()
    if (sessionId) {
      params['wind.sessionid'] = sessionId
    }
  }

  // 使用 qs 库构建查询字符串，处理特殊情况
  const queryString = qs.stringify(params, {
    addQueryPrefix: true, // 自动添加问号前缀
    encode: true, // 编码参数值
    arrayFormat: 'repeat', // 数组参数格式化方式
    allowDots: true, // 允许点表示法
    skipNulls: true, // 跳过 null 值
  })

  // 构建URL并添加hash（仅客户端模式）
  return baseUrl + queryString + (isClient ? '#/' : '')
}

/**
 * 百分站点URL生成器扩展配置
 */
export interface BaiFenSitesConfig extends BaiFenEnvOptions {
  /** 是否为百分终端环境 */
  isBaiFenTerminal: boolean
}

/**
 * 构建百分路径URL的辅助函数 - 内部使用
 */
const buildBaiFenPathUrl = (host: string, path: string) => {
  const isTerminal = usedInClient()
  const baseUrl = buildBaiFenBaseUrl(host)
  return isTerminal ? `${baseUrl}${path}` : buildBaiFenWebLoginUrl(host)
}

/**
 * 构建百分产业市场URL - 内部使用
 * 用于各类产业市场页面（战略性新兴产业、高技术产业等）
 * 百分终端使用 govbusiness hash 路由，其他环境使用市场ID或登录页
 */
const buildBaiFenIndustryMarketUrl = (
  host: string,
  marketIdOrHashPath: string,
  options?: { isBaiFenTerminal: boolean }
) => {
  const { isBaiFenTerminal } = options || {}
  const isTerminal = usedInClient()
  const baseUrl = buildBaiFenBaseUrl(host)

  // 百分终端使用特殊的 hash 路由格式
  if (isBaiFenTerminal) {
    return `${baseUrl}${BaiFenPathConstants.govbusiness}/#/${marketIdOrHashPath}`
  }

  // 其他环境：终端使用市场URL，Web使用登录页
  return isTerminal ? buildBaiFenMarketUrl(host, marketIdOrHashPath) : buildBaiFenWebLoginUrl(host)
}

export const BaiFenSites = (options: BaiFenSitesConfig) => {
  const { isDev, isStaging, isBaiFenTerminal } = options || {}
  const isTerminal = usedInClient()
  const host = getBaiFenHost({ isDev, isStaging })
  const baseUrl = buildBaiFenBaseUrl(host)

  // 如果是终端版本，使用原有的URL，如果是Web版本，统一跳转到登录页
  const getMarketOrLoginUrl = (marketId: string) =>
    isTerminal ? buildBaiFenMarketUrl(host, marketId) : buildBaiFenWebLoginUrl(host)

  // 构建路径URL的快捷方法
  const buildPathUrl = (path: string) => buildBaiFenPathUrl(host, path)

  // 构建产业市场URL的快捷方法
  const buildIndustryMarketUrl = (marketIdOrHashPath: string) =>
    buildBaiFenIndustryMarketUrl(host, marketIdOrHashPath, { isBaiFenTerminal })

  return {
    download: buildPathUrl(BaiFenPathConstants.myenterpriseDownload),
    business: buildPathUrl(BaiFenPathConstants.dashboardBusiness),
    // 对公营销工作台首页
    home: buildPathUrl(BaiFenPathConstants.webHome),
    // 高级筛选
    advancedFilter: buildPathUrl(BaiFenPathConstants.superSearchFilter),
    authDesc: buildPathUrl(BaiFenPathConstants.authDesc),
    // 地区重点项目
    regionalKey: getMarketOrLoginUrl('100153000'),
    // 他行存客
    otherBankCustomers: getMarketOrLoginUrl('100161100'),
    // 网点拓客：发现银行网点周边商机
    branchCustomers: getMarketOrLoginUrl('100152000'),
    // 授信挖掘
    creditMining: getMarketOrLoginUrl('100162000'),
    // 授信商机：大数据模型推荐潜在融资需求企业
    creditOpportunities: isBaiFenTerminal
      ? `${baseUrl}${BaiFenPathConstants.govbusiness}/`
      : getMarketOrLoginUrl('100111000'),
    // 存款商机：大数据模型推荐潜在存款需求企业
    depositOpportunities: getMarketOrLoginUrl('100113000'),
    // 战略性新兴产业：100+战略性新兴产业企业
    strategicIndustries: buildIndustryMarketUrl('100124000'),
    // 高技术产业（制造业）
    highTechManufacturing: buildIndustryMarketUrl('high-tech-manufacture'),
    // 高技术产业（服务业）
    highTechService: buildIndustryMarketUrl('high-tech-service'),
    // 知识产权（专利）密集型产业
    intellectualPropertyIndustry: buildIndustryMarketUrl('ip'),
    // 绿色低碳转型产业
    greenLowCarbonIndustry: buildIndustryMarketUrl('100132000'),
    // 农业及相关产业
    agricultureRelatedIndustry: buildIndustryMarketUrl('agriculture'),
    // 养老产业
    elderlyIndustry: buildIndustryMarketUrl('elder-care'),
    // 数字经济及其核心产业
    digitalEconomyIndustry: buildIndustryMarketUrl('digital'),
    // 智能财报诊断
    report: buildPathUrl(BaiFenPathConstants.reportAnalysis),
    // 向后兼容：reportAnalysis 别名
    reportAnalysis: buildPathUrl(BaiFenPathConstants.reportAnalysis),
    // 获取融资详情链接的方法
    getFinancingDetails: (params: FinancingDetailsParams) =>
      isTerminal ? buildBaiFenFinancingDetailsUrl(host, params) : buildBaiFenWebLoginUrl(host),
    // 获取财报分析流程链接的方法（百分-智能财报诊断）
    getReportAnalysisProcessForGel: (params: ReportAnalysisProcessParams) => buildBaiFenReportAnalysisUrl(host, params),
    // 导出工具函数供外部使用
    getBaseUrl: () => baseUrl,
    getHost: () => host,
  }
}
