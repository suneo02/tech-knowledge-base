import { isDev, TGelEnv } from '@/utils/env'
import { getCurrentEnv } from 'gel-util/env'
import { GEL_WEB, GEL_WEB_TEST, GELService, PC_Front, WFC_Enterprise_Web } from 'gel-util/link'

/**
 * 通用获取服务URL前缀的方法
 * @param options 配置项
 * @param options.service 服务名称 (例如: 'Company', 'Group' 等)
 * @param options.isLoginIn 是否登录
 * @param options.envParam 环境参数
 * @returns
 */
export const getGeneralPrefixUrl = ({
  service,
  isLoginIn = false,
  envParam,
}: {
  service: GELService
  isLoginIn?: boolean
  envParam?: TGelEnv
}) => {
  try {
    const env = envParam || getCurrentEnv(isDev)
    let serverUrl

    switch (env) {
      case 'terminal':
        serverUrl = `/${WFC_Enterprise_Web}/${PC_Front}/${service}/`
        break
      case 'local':
        serverUrl = '/'
        break
      case 'webTest':
        serverUrl = isLoginIn ? `/${GEL_WEB_TEST}/` : `/${WFC_Enterprise_Web}/${PC_Front}/${service}/`
        break
      case 'web':
        serverUrl = isLoginIn ? `/${GEL_WEB}/` : `/${WFC_Enterprise_Web}/${PC_Front}/${service}/`
        break
      default:
        serverUrl = '/'
    }
    return `${window.location.protocol}//${window.location.host}${serverUrl}`
  } catch (e) {
    console.error(e)
  }
}
/**
 * 获得 GEL PC 项目 路径前缀 (为保持向后兼容)
 * 建议使用更通用的 getGeneralPrefixUrl
 */
export const getPrefixUrl = ({ isLoginIn, envParam }: { isLoginIn?: boolean; envParam?: TGelEnv } = {}) => {
  return getGeneralPrefixUrl({
    service: GELService.Company,
    isLoginIn,
    envParam,
  })
}
