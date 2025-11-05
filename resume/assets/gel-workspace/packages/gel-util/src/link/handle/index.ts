import { getCurrentEnv, TGelEnv, usedInClient } from '@/env'

import path from 'path-browserify'
import { DEFAULT_HTML_PATH, getLinkConfigMap } from '../config'
import { LinkModule } from '../config/linkModule'
import { LinkParams } from '../config/params'
import { ETerminalCommandId, getTerminalCommandLink } from '../terminal'
import { stringifyObjectToParams } from './param'
import { generatePrefixUrl } from './prefixUrl'

export { handleJumpTerminalCompatible } from './jump'

// 生成 URL 的函数
export function generateUrlByModule<T extends LinkModule>({
  module,
  params,
  isDev = false,
  options = {},
}: {
  module: T
  params: LinkParams[T]
  isDev?: boolean
  options?: {
    customPrefixPath?: string
    customHtmlPath?: string
    env?: TGelEnv
  }
}): string | undefined {
  try {
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

    // 根据配置决定是否将参数添加到hash后面
    if (config.appendParamsToHash) {
      // 将参数添加到hash后面
      const paramsString = stringifyObjectToParams(params)
      baseUrl.hash = config.hash + (paramsString ? `?${paramsString}` : '')
    } else {
      // 设置 hash
      baseUrl.hash = config.hash
      // 将参数作为查询参数添加到URL
      baseUrl.search = stringifyObjectToParams(params)
    }

    return baseUrl.toString()
  } catch (e) {
    console.error('generateUrl error', e)
  }
}
