import { getUrlByLinkModule } from '@/handle/link/handle/generateOverall.ts'
import { getEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { LinksModule, UserLinkEnum } from '../module'
import { Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
const STRINGS = {
  jumpToBaiFenUrl: t('452754', '该数据由合作方 百分企业 提供，如需查看详情请前往百分企业官网查看'),
  jumpToBaiFenUrlTitle: t('31041', '提示'),
  jumpToBaiFenUrlOkText: t('257641', '查看'),
}

const { env } = getEnvParams()

export const BaiFenHostMap = {
  terminal: 'govwebsite', // 终端中
  // 如果在 gel 环境， 使用 wx.wind.com.cn 地址， 否则使用 当前 host 地址
  web: env === 'web' ? 'wx.wind.com.cn' : window.location.host, // web 地址
}

export const BaiFenPathConstants = {
  govbusiness: '/govbusiness',
}

export const BaiFenHashConstants = {
  strategicIndustries: '/strategy',
}
// 本地开发也视为终端
const isTerminalG = wftCommon.usedInClient()

export const getBaiFenHost = (isTerminal?: boolean) => {
  const terminalState = isTerminal ?? isTerminalG
  return terminalState ? BaiFenHostMap.terminal : BaiFenHostMap.web
}

// 生成基础URL
const getBaseUrl = (host: string) => `https://${host}`

// 生成市场相关URL - 终端版本使用
const getMarketUrl = (host: string, marketId: string) =>
  `${getBaseUrl(host)}${BaiFenPathConstants.govbusiness}/#/web-market/${marketId}`

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

interface BaiFenSitesOptions {
  isTerminal?: boolean
}

export const BaiFenSites = (options?: BaiFenSitesOptions) => {
  const isTerminal = options?.isTerminal ?? isTerminalG
  const isBaiFenTerminal = wftCommon.isBaiFenTerminal()
  // 计算得出的 host 有可能是 终端，也有可能是 web
  const host = getBaiFenHost(isTerminal)
  const baseUrl = getBaseUrl(host)

  // 如果是终端版本，使用原有的URL，如果是Web版本，统一跳转到登录页
  const getUrlOrLogin = (marketId: string) => (isTerminal ? getMarketUrl(host, marketId) : getBaiFenLoginUrl(host))

  const getUrl = (marketId: string) => {
    if (isBaiFenTerminal) {
      return `${getBaseUrl(host)}${BaiFenPathConstants.govbusiness}/#/${marketId}`
    }
    return getUrlOrLogin(marketId)
  }

  return {
    download: isTerminal
      ? `${baseUrl}${BaiFenPathConstants.govbusiness}/#/myenterprise/download`
      : getBaiFenLoginUrl(host),
    business: isTerminal
      ? `${baseUrl}${BaiFenPathConstants.govbusiness}/#/dashboard/business0`
      : getBaiFenLoginUrl(host),
    // 对公营销工作台首页
    home: isTerminal ? `${baseUrl}${BaiFenPathConstants.govbusiness}/#/web-home` : getBaiFenLoginUrl(host),
    // 高级筛选
    advancedFilter: isTerminal
      ? `${baseUrl}${BaiFenPathConstants.govbusiness}/#/super-search/filter`
      : getBaiFenLoginUrl(host),
    // 地区重点项目
    regionalKey: getUrlOrLogin('100153000'),
    // 他行存客
    otherBankCustomers: getUrlOrLogin('100161100'),
    // 网点拓客：发现银行网点周边商机
    branchCustomers: getUrlOrLogin('100152000'),
    // 授信挖掘
    creditMining: getUrlOrLogin('100162000'),
    //
    // 授信商机：大数据模型推荐潜在融资需求企业 web 端不做跳转, 百分终端链接稍有不同
    creditOpportunities: isBaiFenTerminal
      ? `${baseUrl}${BaiFenPathConstants.govbusiness}/`
      : isTerminal
        ? getMarketUrl(host, '100111000')
        : undefined,
    // 存款商机：大数据模型推荐潜在存款需求企业
    depositOpportunities: getUrlOrLogin('100113000'),
    // 战略性新兴产业：100+战略性新兴产业企业
    strategicIndustries: getUrl('100124000'),
    // 高技术产业（制造业）
    highTechManufacturing: getUrl('high-tech-manufacture'),
    // 高技术产业（服务业）
    highTechService: getUrl('high-tech-service'),
    // 知识产权（专利）密集型产业
    intellectualPropertyIndustry: getUrl('ip'),
    // 绿色低碳转型产业
    greenLowCarbonIndustry: getUrl('100132000'),
    // 农业及相关产业
    agricultureRelatedIndustry: getUrl('agriculture'),
    // 养老产业
    elderlyIndustry: getUrl('elder-care'),
    // 数字经济及其核心产业
    digitalEconomyIndustry: getUrl('digital'),
    // 获取融资详情链接的方法
    getFinancingDetails: (params: FinancingDetailsParams) =>
      isTerminal ? getFinancingDetailsUrl(host, params) : getBaiFenLoginUrl(host),
    // 跳转百分链接，针对与
    jumpToBaiFenUrl: (url: string, params?: Record<string, string>) => {
      if (!isBaiFenTerminal && !isTerminal) {
        Modal.info({
          title: STRINGS.jumpToBaiFenUrlTitle,
          content: STRINGS.jumpToBaiFenUrl,
          okText: STRINGS.jumpToBaiFenUrlOkText,
          onOk: () => {
            window.open(`${getBaseUrl(host)}/baifenweb/`)
          },
        })
        return
      }
      window.open(`${url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`)
    },
  }
}

/**
 * 获得百分或者企业库报告下载页面
 */
export const getCompanyReportDownPage = (options?: BaiFenSitesOptions) => {
  let url: string | undefined
  if (options?.isTerminal ?? wftCommon.isBaiFenTerminal()) {
    url = BaiFenSites(options).download
  } else {
    url = getUrlByLinkModule(LinksModule.USER, {
      subModule: UserLinkEnum.MyData,
    })
  }
  return url
}
