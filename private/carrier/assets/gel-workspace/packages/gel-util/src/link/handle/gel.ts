import { getCurrentEnv, TGelEnv, usedInClient } from '@/env'

import path from 'path-browserify'
import { stringifyObjectToParams } from '../../common'
import { DEFAULT_HTML_PATH, getLinkConfigMap, LinkModule } from '../config'

import { checkRequiredParams } from '../config/params'
import { generatePrefixUrl } from '../prefixUrl'
import { ETerminalCommandId, getTerminalCommandLink } from '../terminal'
import { GetLinkParams } from '../type'
import { isFromRimePEVC } from '../out'
import { getUrlSearchValue } from '@/common'

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
    if (module === LinkModule.WINDCODE_2_F9) {
      const windcodeParams = params as GetLinkParams<LinkModule.WINDCODE_2_F9>
      if (usedInClient()) {
        if (!checkRequiredParams(module as LinkModule.WINDCODE_2_F9, windcodeParams)) {
          console.warn(`Missing required parameters for module: ${module}`)
          return undefined
        }
        return (
          getTerminalCommandLink(ETerminalCommandId.F9, {
            windcode: windcodeParams?.windcode || '',
          }) ?? undefined
        )
      }
      return undefined
    }
    if (module === LinkModule.COMPANY_DETAIL) {
      const companyParams = params as GetLinkParams<LinkModule.COMPANY_DETAIL>
      if (usedInClient()) {
        if (!checkRequiredParams(module as LinkModule.COMPANY_DETAIL, companyParams)) {
          console.warn(`Missing required parameters for module: ${module}`)
          return undefined
        }
        return (
          getTerminalCommandLink(ETerminalCommandId.COMPANY, {
            CompanyCode: companyParams?.companycode || '',
          }) ?? undefined
        )
      }
    }
    const config = getLinkConfigMap(isDev)[module]

    if (!config) {
      console.error(`No configuration found for module: ${module}`)
      return
    }
    if (config.customGenerate) {
      return config.customGenerate(config)
    }

    const finalParams = {
      ...(config.defaultParams || {}),
      ...(isFromRimePEVC()
        ? { linksource: 'rimepevc', ['wind.sessionid']: getUrlSearchValue('wind.sessionid') || '' }
        : {}),
      ...params,
    } as GetLinkParams<T>

    if (!checkRequiredParams(module, finalParams)) {
      console.warn(`Missing required parameters for module: ${module}`)
      return undefined
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
    if (config.hashPathParam && finalParams && typeof finalParams === 'object' && config.hashPathParam in finalParams) {
      // 支持在hash中添加路径段，如 /chat/123
      const paramsRecord = finalParams as Record<string, unknown>
      const pathValue = paramsRecord[config.hashPathParam]
      const pathSegment = pathValue ? `/${pathValue}` : ''
      const remainingParams: Record<string, unknown> = { ...(finalParams as Record<string, unknown>) }
      delete remainingParams[config.hashPathParam]

      const paramsString = stringifyObjectToParams(remainingParams)
      baseUrl.hash = config.hash + pathSegment + (paramsString ? `?${paramsString}` : '')
    } else if (config.appendParamsToHash) {
      // 将参数添加到hash后面
      const paramsString = stringifyObjectToParams(finalParams || {})
      baseUrl.hash = config.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      // 设置 hash
      baseUrl.hash = config.hash
      // 将参数作为查询参数添加到URL
      baseUrl.search = stringifyObjectToParams(finalParams || {})
    }

    return baseUrl.toString()
  } catch (e) {
    console.error('generateUrl error', e)
  }
}
