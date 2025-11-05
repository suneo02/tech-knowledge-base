import { AxiosRequestConfig } from 'axios'
import { WIND_ENT_WEB_PATH, entWebApiCfg } from './entWeb'
import { INDICATOR_API_PATH, indicatorApiCfg } from './indicator'
import { SUPERLIST_API_PATH, superlistApiCfg } from './superlist'
import { APIServer, PathsForServer } from './types/common'
import { WFC_API_PATH, wfcApiCfg } from './wfc'

export * from './chat'
export * from './config'
export * from './entWeb'
export * from './indicator'
export * from './pathType'
export * from './requestFunc'
export * from './superlist'
export * from './types'
export * from './wfc'
export * from './windSecure'
export * from './bury'

/**
 * 在此处定义一些常量配置
 */
export const ApiCfg: Partial<Record<APIServer, Partial<Record<keyof PathsForServer<APIServer>, AxiosRequestConfig>>>> =
  {
    [WFC_API_PATH]: wfcApiCfg,
    [INDICATOR_API_PATH]: indicatorApiCfg,
    [SUPERLIST_API_PATH]: superlistApiCfg,
    [WIND_ENT_WEB_PATH]: entWebApiCfg,
  }
