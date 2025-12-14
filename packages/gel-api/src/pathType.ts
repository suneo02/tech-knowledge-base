import { WIND_ENT_CHAT_PATH, chatApiPathMap } from './chat'
import { WIND_ENT_WEB_PATH, entWebApiPathMap } from './entWeb'
import { INDICATOR_API_PATH, indicatorApiPathMap } from './indicator'
import { SUPERLIST_API_PATH, superlistApiPathMap } from './superlist'
import { WFC_API_PATH, wfcApiPathMap } from './wfc'

// ApiPaths类型只需要为当前实现的服务器路径提供定义
export type ApiPaths = {
  [WIND_ENT_CHAT_PATH]: chatApiPathMap
  [WFC_API_PATH]: wfcApiPathMap
  [INDICATOR_API_PATH]: indicatorApiPathMap
  [SUPERLIST_API_PATH]: superlistApiPathMap
  [WIND_ENT_WEB_PATH]: entWebApiPathMap
}
