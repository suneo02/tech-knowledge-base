import { AxiosRequestConfig } from 'axios'
import { chatApiCfg, WIND_ENT_CHAT_PATH } from './chat'
import { entWebApiCfg, WIND_ENT_WEB_PATH } from './entWeb'
import { INDICATOR_API_PATH, indicatorApiCfg } from './indicator'
import { SUPERLIST_API_PATH, superlistApiCfg } from './superlist'
import { APIServer, PathsForServer } from './types/common'
import { WFC_API_PATH, wfcApiCfg } from './wfc'

/**
 * API 配置中心
 * 
 * @description 集中管理各个 API 服务的配置，避免循环依赖
 */
export const ApiCfg: Partial<Record<APIServer, Partial<Record<keyof PathsForServer<APIServer>, AxiosRequestConfig>>>> =
  {
    [WFC_API_PATH]: wfcApiCfg,
    [INDICATOR_API_PATH]: indicatorApiCfg,
    [SUPERLIST_API_PATH]: superlistApiCfg,
    [WIND_ENT_WEB_PATH]: entWebApiCfg,
    [WIND_ENT_CHAT_PATH]: chatApiCfg,
  }
