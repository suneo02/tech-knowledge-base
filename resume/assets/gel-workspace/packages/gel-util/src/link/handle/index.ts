import { getCurrentEnv, TGelEnv, usedInClient } from '@/env'

import path from 'path-browserify'
import { stringifyObjectToParams } from '../../common'
import { DEFAULT_HTML_PATH, getLinkConfigMap, LinkModule, LinkParams } from '../config'

import { checkRequiredParams, UserLinkParamEnum } from '../config/params'
import type { FinancingDetailsParams } from '../out/baiFen'
import { BaiFenSites } from '../out/baiFen'
import { getPayWebLink, PayWebModule, PayWebParams } from '../out/payweb'
import { getRimeOrganizationUrl, RimeTargetType } from '../out/rime'
import { getRiskOutUrl, RiskOutModule } from '../out/risk'
import { getWKGUrl, WKGModule } from '../out/WKG'
import { generatePrefixUrl } from '../prefixUrl'
import { ETerminalCommandId, getTerminalCommandLink } from '../terminal'
import { GetLinkParams } from '../type'

export { GELService, generatePrefixUrl } from '../prefixUrl'
export { handleJumpTerminalCompatible } from './jump'

/**
 * 生成 URL 的参数类型
 * @param T - 模块类型
 * @returns 生成 URL 的参数类型
 */
export type GenerateUrlByModuleOptions<T extends LinkModule> = {
  module: T
  params?: GetLinkParams<T>
  isDev?: boolean
  options?: {
    customPrefixPath?: string
    customHtmlPath?: string
    env?: TGelEnv
  }
}

// 生成 URL 的函数
export function generateUrlByModule<T extends LinkModule>({
  module,
  params,
  isDev = false,
  options = {},
}: GenerateUrlByModuleOptions<T>): string | undefined {
  try {
    // 检查必须的参数是否存在
    if (!checkRequiredParams(module, params)) {
      console.warn(`Missing required parameters for module: ${module}`)
      return undefined
    }

    // windCode 跳转
    // 此处链接只有在终端中才有效，建议移动到外部，直接调用 getTerminalCommandLink
    if (module === LinkModule.WINDCODE_2_F9) {
      const windcodeParams = params as LinkParams[LinkModule.WINDCODE_2_F9]
      if (usedInClient()) {
        return (
          getTerminalCommandLink(ETerminalCommandId.F9, {
            windcode: windcodeParams?.windcode || '',
          }) ?? ''
        )
      }
      return ''
    }
    // 企业详情 如果在终端中需要特殊处理 f9
    if (module === LinkModule.COMPANY_DETAIL) {
      const companyParams = params as LinkParams[LinkModule.COMPANY_DETAIL]
      if (usedInClient()) {
        return (
          getTerminalCommandLink(ETerminalCommandId.COMPANY, {
            CompanyCode: companyParams?.companycode || '',
          }) ?? ''
        )
      }
    }
    //
    const config = getLinkConfigMap(isDev)[module]

    if (!config) {
      console.error(`No configuration found for module: ${module}`)
      return
    }
    if (config.customGenerate) {
      return config.customGenerate(config)
    }

    const env = options.env || getCurrentEnv(isDev)
    // 获取环境特定配置
    const envSpecificConfig = env ? config.envConfig?.[env] : undefined

    // 构建基础 URL
    const prefixPath =
      options.customPrefixPath || envSpecificConfig?.prefixPath || config.prefixPath || generatePrefixUrl({ isDev })

    const htmlPath = options.customHtmlPath || envSpecificConfig?.htmlPath || config.htmlPath || DEFAULT_HTML_PATH

    // 设置 origin
    const origin = envSpecificConfig?.origin || window.location.origin
    const baseUrl = new URL(path.join(prefixPath, htmlPath), origin)

    // 根据配置决定如何处理hash和参数
    if (config.hashPathParam && params && typeof params === 'object' && config.hashPathParam in params) {
      // 支持在hash中添加路径段，如 /chat/123
      const paramsRecord = params as Record<string, unknown>
      const pathValue = paramsRecord[config.hashPathParam]
      const pathSegment = pathValue ? `/${pathValue}` : ''
      const remainingParams: Record<string, unknown> = { ...(params as Record<string, unknown>) }
      delete remainingParams[config.hashPathParam]

      const paramsString = stringifyObjectToParams(remainingParams)
      baseUrl.hash = config.hash + pathSegment + (paramsString ? `?${paramsString}` : '')
    } else if (config.appendParamsToHash) {
      // 将参数添加到hash后面
      const paramsString = stringifyObjectToParams(params || {})
      baseUrl.hash = config.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      // 设置 hash
      baseUrl.hash = config.hash
      // 将参数作为查询参数添加到URL
      baseUrl.search = stringifyObjectToParams(params || {})
    }

    return baseUrl.toString()
  } catch (e) {
    console.error('generateUrl error', e)
  }
}

/**
 * 统一 URL 生成入口
 * 支持四类：module / rime / risk / payweb
 */
export type GenerateUrlInput =
  | {
      target: 'module'
      module: LinkModule
      params?: GetLinkParams<LinkModule>
      isDev?: boolean
      options?: {
        customPrefixPath?: string
        customHtmlPath?: string
        env?: TGelEnv
      }
    }
  | {
      target: 'rime'
      id?: string
      isTerminal?: boolean
      isTestSite?: boolean
      targetType?: RimeTargetType
    }
  | {
      target: 'risk'
      riskModule: RiskOutModule
    }
  | {
      target: 'payweb'
      paywebModule: PayWebModule
      params: PayWebParams[PayWebModule]
      isDev?: boolean
    }
  | {
      target: 'baifen'
      route?:
        | 'download'
        | 'business'
        | 'home'
        | 'advancedFilter'
        | 'regionalKey'
        | 'otherBankCustomers'
        | 'branchCustomers'
        | 'creditMining'
        | 'creditOpportunities'
        | 'depositOpportunities'
        | 'strategicIndustries'
        | 'financingDetails'
        | 'report'
      isTerminal?: boolean
      financingDetailsParams?: FinancingDetailsParams
    }
  | {
      target: 'wkg'
      module: WKGModule
    }

export const generateUrl = (input: GenerateUrlInput): string => {
  try {
    switch (input.target) {
      case 'module': {
        const { module, params, isDev, options } = input
        return generateUrlByModule({ module, params, isDev, options })!
      }
      case 'rime': {
        const { id, isTerminal, isTestSite, targetType } = input
        return getRimeOrganizationUrl({ id, isTerminal, isTestSite, type: targetType })
      }
      case 'risk': {
        const { riskModule } = input
        return getRiskOutUrl(riskModule)
      }
      case 'payweb': {
        const { paywebModule, params, isDev } = input
        return getPayWebLink(paywebModule, params, isDev)!
      }
      case 'baifen': {
        const { route = 'home', isTerminal, financingDetailsParams } = input
        const sites = BaiFenSites({ isTerminal })
        switch (route) {
          case 'download':
            return sites.download
          case 'business':
            return sites.business
          case 'home':
            return sites.home
          case 'advancedFilter':
            return sites.advancedFilter
          case 'regionalKey':
            return sites.regionalKey
          case 'otherBankCustomers':
            return sites.otherBankCustomers
          case 'branchCustomers':
            return sites.branchCustomers
          case 'creditMining':
            return sites.creditMining
          case 'creditOpportunities':
            return sites.creditOpportunities
          case 'depositOpportunities':
            return sites.depositOpportunities
          case 'strategicIndustries':
            return sites.strategicIndustries
          case 'report':
            return sites.report
          case 'financingDetails':
            return sites.getFinancingDetails((financingDetailsParams as FinancingDetailsParams)!)
          default:
            return sites.home
        }
      }
      case 'wkg': {
        const { module } = input
        return getWKGUrl(module) ?? ''
      }
      default:
        return generateUrlByModule({ module: LinkModule.SEARCH_HOME })!
    }
  } catch (e) {
    console.error('generateUrl input error', e)
    return generateUrlByModule({ module: LinkModule.SEARCH_HOME })!
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
