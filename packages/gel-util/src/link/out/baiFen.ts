import { LinkModule } from '../config/linkModule'
import { UserLinkParamEnum } from '../config/params/user'
import { generateUrlByModule } from '../handle'

export const BaiFenHostMap = {
  terminal: 'govwebsite', // 终端中
  web: 'dgov.wind.com.cn', // web 地址
}

export const BaiFenHost = (isTerminal?: boolean) => {
  const terminalState = isTerminal
  return terminalState ? BaiFenHostMap.terminal : BaiFenHostMap.web
}

// 生成基础URL
const getBaseUrl = (host: string) => `https://${host}`

// 生成市场相关URL - 终端版本使用
const getMarketUrl = (host: string, marketId: string) => `${getBaseUrl(host)}/govbusiness/#/web-market/${marketId}`

// 生成百分企业官网登录页URL
const getBaiFenLoginUrl = (host: string) => `${getBaseUrl(host)}/baifenweb/`

export interface FinancingDetailsParams {
  companyId: string
  corpId: string
  title?: string
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
  return `${getBaseUrl(host)}/govbusiness/?${queryParams.toString()}#/corpInfo`
}

export const BaiFenSites = (options?: { isTerminal?: boolean }) => {
  const isTerminal = options?.isTerminal
  const host = BaiFenHost(isTerminal)
  const baseUrl = getBaseUrl(host)

  // 如果是终端版本，使用原有的URL，如果是Web版本，统一跳转到登录页
  const getUrl = (marketId: string) => (isTerminal ? getMarketUrl(host, marketId) : getBaiFenLoginUrl(host))

  return {
    download: isTerminal ? `${baseUrl}/govbusiness/#/myenterprise/download` : getBaiFenLoginUrl(host),
    business: isTerminal ? `${baseUrl}/govbusiness/#/dashboard/business0` : getBaiFenLoginUrl(host),
    // 对公营销工作台首页
    home: isTerminal ? `${baseUrl}/govbusiness/#/web-home` : getBaiFenLoginUrl(host),
    // 高级筛选
    advancedFilter: isTerminal ? `${baseUrl}/govbusiness/#/super-search/filter` : getBaiFenLoginUrl(host),
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
    // 获取融资详情链接的方法
    getFinancingDetails: (params: FinancingDetailsParams) =>
      isTerminal ? getFinancingDetailsUrl(host, params) : getBaiFenLoginUrl(host),
  }
}

/**
 * 获得百分或者企业库报告下载页面
 */
export const getCompanyReportDownPage = (options: {
  isTerminal?: boolean
  isBaiFenTerminal?: boolean
  isDev: boolean
}) => {
  let url: string | undefined
  if (options?.isTerminal ?? options?.isBaiFenTerminal) {
    url = BaiFenSites(options).download
  } else {
    url = generateUrlByModule({
      module: LinkModule.USER_CENTER,
      params: { type: UserLinkParamEnum.MyData },
      isDev: options?.isDev,
    })
  }
  return url
}
