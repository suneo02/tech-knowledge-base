import { getCurrentEnv, usedInClient } from '@/env'
import qs from 'qs'

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
} as const

/**
 * 百分环境配置选项
 */
export interface BaiFenEnvOptions {
  /** 是否为终端环境 */
  isTerminal?: boolean
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
    web: isDev || isStaging ? window.location.host : env === 'web' ? 'wx.wind.com.cn' : window.location.host, // web 地址
  }
}

export const getBaiFenHost = (options?: BaiFenEnvOptions) => {
  const { isTerminal = usedInClient(), isDev, isStaging } = options || {}
  const hostMap = getBaiFenHostMap({ isDev, isStaging })
  return isTerminal ? hostMap.terminal : hostMap.web
}

// 生成基础URL
const getBaseUrl = (host: string) => {
  const protocol = window.location.protocol
  return `${protocol}//${host}`
}

// 生成市场相关URL - 终端版本使用
const getMarketUrl = (host: string, marketId: string) =>
  `${getBaseUrl(host)}${BaiFenPathConstants.webMarket.replace('{marketId}', marketId)}`

// 生成百分企业官网登录页URL
const getBaiFenLoginUrl = (host: string) => `${getBaseUrl(host)}${BaiFenPathConstants.baifenweb}/`

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

// 生成融资详情URL
const getFinancingDetailsUrl = (host: string, params: FinancingDetailsParams) => {
  const { companyId, corpId, title } = params
  const queryParams = new URLSearchParams()
  queryParams.append('companyId', companyId)
  queryParams.append('corpId', corpId)
  if (title) {
    queryParams.append('title', encodeURIComponent(title))
  }
  return `${getBaseUrl(host)}${BaiFenPathConstants.corpInfo.replace('{query}', queryParams.toString())}`
}

// 生成财报分析流程URL
const getReportAnalysisProcessUrl = (host: string, params: ReportAnalysisProcessParams) => {
  const { id } = params
  const queryParams = new URLSearchParams()
  queryParams.append('id', id)
  return `${getBaseUrl(host)}${BaiFenPathConstants.reportAnalysisProcessForGelBase}?${queryParams.toString()}${BaiFenPathConstants.reportAnalysisProcessForGelHash}`
}

/**
 * 地图URL参数接口定义
 */
export interface MapUrlParams {
  mode?: string | number
  pureMode?: boolean
  title?: string
  right?: string
  companyId: string
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
  corpId: string
  /** 是否为业务地址 */
  isBusinessAddress: boolean
  /** 会话ID */
  sessionId?: string
  /** 是否为客户端环境 */
  isClient?: boolean
}

/**
 * 构建地图URL
 */
export const getGovMapUrl = (options: BuildMapUrlOptions): string => {
  const { corpId, isBusinessAddress, sessionId, isClient = usedInClient() } = options

  // 使用BaiFenHost获取正确的主机名
  const host = getBaiFenHost({ isTerminal: isClient })

  // 构建基础URL（使用当前环境的协议）
  const protocol = window.location.protocol
  const baseUrl = `${protocol}//${host}${BaiFenPathConstants.govmap}`

  // 构建参数对象
  const params: MapUrlParams = {
    mode: 2,
    pureMode: true,
    title: '万寻地图',
    right: '4C203DE15',
    companyId: corpId,
  }

  // 有条件地添加参数
  if (isBusinessAddress) {
    params.addressType = 'businessAddress'
    params['1'] = '1' // 保留原有的特殊参数
  }

  if (sessionId) {
    params['wind.sessionid'] = sessionId
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

export const BaiFenSites = (options?: BaiFenEnvOptions) => {
  const { isTerminal, isDev, isStaging } = options || {}
  const host = getBaiFenHost({ isTerminal, isDev, isStaging })
  const baseUrl = getBaseUrl(host)

  // 如果是终端版本，使用原有的URL，如果是Web版本，统一跳转到登录页
  const getUrl = (marketId: string) => (isTerminal ? getMarketUrl(host, marketId) : getBaiFenLoginUrl(host))

  return {
    download: isTerminal ? `${baseUrl}${BaiFenPathConstants.myenterpriseDownload}` : getBaiFenLoginUrl(host),
    business: isTerminal ? `${baseUrl}${BaiFenPathConstants.dashboardBusiness}` : getBaiFenLoginUrl(host),
    // 对公营销工作台首页
    home: isTerminal ? `${baseUrl}${BaiFenPathConstants.webHome}` : getBaiFenLoginUrl(host),
    // 高级筛选
    advancedFilter: isTerminal ? `${baseUrl}${BaiFenPathConstants.superSearchFilter}` : getBaiFenLoginUrl(host),
    // 地区重点项目
    regionalKey: getUrl('100153000'),
    // 他行存客
    otherBankCustomers: getUrl('100161100'),
    // 网点拓客：发现银行网点周边商机
    branchCustomers: getUrl('100152000'),
    // 授信挖掘
    creditMining: getUrl('100162000'),
    // 授信商机：大数据模型推荐潜在融资需求企业
    creditOpportunities: getUrl('100111000'),
    // 存款商机：大数据模型推荐潜在存款需求企业
    depositOpportunities: getUrl('100113000'),
    // 战略性新兴产业：100+战略性新兴产业企业
    strategicIndustries: getUrl('100124000'),
    // 智能财报诊断
    report: isTerminal ? `${baseUrl}${BaiFenPathConstants.reportAnalysis}` : getBaiFenLoginUrl(host),
    // 获取融资详情链接的方法
    getFinancingDetails: (params: FinancingDetailsParams) =>
      isTerminal ? getFinancingDetailsUrl(host, params) : getBaiFenLoginUrl(host),
    // 获取财报分析流程链接的方法（百分-智能财报诊断）
    getReportAnalysisProcessForGel: (params: ReportAnalysisProcessParams) => getReportAnalysisProcessUrl(host, params),
  }
}
