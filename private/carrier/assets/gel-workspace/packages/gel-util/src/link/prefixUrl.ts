import { getCurrentEnv, TGelEnv } from '@/env'
import path from 'path-browserify'
import { PC_Front, WFC_Enterprise_Web } from './constant'

export enum GELService {
  Company = 'Company', // gel pc 项目
  AI = 'ai', // 新 AI 聊天项目
  ReportPreview = 'reportpreview', // 新报告项目
  ReportPrint = 'reportprint', // 新报告打印项目
  ReportAI = 'reportai', // 新报告 AI 项目
  GovMap = 'govmap', // 万寻地图项目
  EAPI = 'wind.ent.openapi', // EAPI 项目
}

/**
 * 通用获取服务URL前缀的方法
 * @param options 配置项
 * @param options.service 服务名称 (例如: 'Company', 'Group' 等)
 * @param options.envParam 环境参数
 * @returns
 */
export const generatePrefixUrl = ({
  service = GELService.Company,
  envParam,
  isDev,
}: {
  service?: GELService
  envParam?: TGelEnv
  isDev: boolean
}) => {
  try {
    const env = envParam || getCurrentEnv(isDev)
    let serverUrl

    switch (env) {
      case 'terminalWeb':
      case 'terminal':
      case 'web':
      case 'webTest':
        serverUrl = path.join(WFC_Enterprise_Web, PC_Front, service)
        break
      case 'local': // local先保留 万一后续有调整的需要
      default:
        serverUrl = '/'
    }
    return serverUrl
  } catch (e) {
    console.error(e)
    return ''
  }
}
