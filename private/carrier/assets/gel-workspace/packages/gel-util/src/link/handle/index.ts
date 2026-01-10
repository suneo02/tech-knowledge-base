/**
 * 链接配置管理 - URL 生成与跳转处理
 *
 * 提供统一的 URL 生成入口，支持多业务模块、多环境配置
 *
 * @see ../../docs/link-config-design.md 设计文档
 */

import { TGelEnv } from '@/env'

import { LinkModule } from '../config'

import { UserLinkParamEnum } from '../config/params'
import { BaiFenSites } from '../out/baiFen'
import { getPayWebLink, PayWebModule, PayWebParams } from '../out/payweb'
import { getRimeLink, getRimeOrganizationUrl, RimeLinkModule, RimeLinkParams, RimeTargetType } from '../out/rime'
import { getRiskOutUrl, RiskOutModule } from '../out/risk'
import { buildBaiFenMapUrl, BuildMapUrlOptions, FinancingDetailsParams } from '../out/baiFen'
import { getWKGUrl, WKGModule } from '../out/WKG'
import { GetLinkParams } from '../type'
import { generateUrlByModule } from './gel'

export { GELService, generatePrefixUrl } from '../prefixUrl'
export { generateUrlByModule } from './gel'
export { handleJumpTerminalCompatible } from './jump'
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
      targetType?: RimeTargetType
      module?: RimeLinkModule
      params?: RimeLinkParams[RimeLinkModule]
      isDev?: boolean
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
        | 'map'
      isTerminal?: boolean
      financingDetailsParams?: FinancingDetailsParams
      mapParams?: BuildMapUrlOptions
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
        const { id, targetType, module, params, isDev } = input
        if (module !== undefined) {
          return getRimeLink(module, params, isDev)
        }
        return getRimeOrganizationUrl({ id, type: targetType })
      }
      case 'risk': {
        const { riskModule } = input
        return getRiskOutUrl(riskModule) || ''
      }
      case 'payweb': {
        const { paywebModule, params, isDev } = input
        return getPayWebLink(paywebModule, params, isDev)!
      }
      case 'baifen': {
        const { route = 'home', financingDetailsParams } = input
        // TODO 这里默认是false，后续根据环境变量来判断是否是终端
        const sites = BaiFenSites({ isBaiFenTerminal: false })
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
          case 'map':
            return buildBaiFenMapUrl(input.mapParams || {})
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
  isBaiFenTerminal: boolean
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
