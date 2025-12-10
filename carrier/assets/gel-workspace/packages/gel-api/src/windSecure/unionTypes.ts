/**
 * WindSecure 模块联合类型定义
 * 
 * @description 将联合类型独立出来，避免循环依赖
 * 注意：只导入类型定义文件，不导入包含函数的文件（如 handle.ts）
 */

import { TrademarkBasicNumData, UserPackageInfo } from 'gel-types'
import {
  CDEFilterCategory,
  getCDEFilterCfgParams,
  getCDEFilterCfgPayload,
} from './CDE/getFilterCfg'
import {
  CDEFilterResResponse,
  getCDEFilterResParams,
  getCDEFilterResPayload,
} from './CDE/getFilterRes'
import {
  CDEIndicatorItem,
  getCDEIndicatorParams,
  getCDEIndicatorPayload,
} from './CDE/getIndicator'
import {
  getCorpListPresearchParams,
  getCorpListPresearchPayload,
  getCorpListPresearchResponse,
} from './CDE/corpListPresearch'
import { getIntellectualAggsParams, getIntellectualAggsPayload } from './corp/intellectual'
import { getDocTaskListParams, getDocTaskListPayload, getDocTaskListResponse } from './docTask'
import { TranslateParams, TranslatePayload, TranslateResponse } from './misc'
import { CreateInvestReportParams, CreateInvestReportPayload } from './report'
import { FeturedSearchResponse } from './search'
import { GetUserPackageInfoParams } from './user'

export type WindSecureApiResponse =
  | CDEFilterCategory[]
  | CDEFilterResResponse
  | CDEIndicatorItem[]
  | UserPackageInfo
  | getCorpListPresearchResponse[]
  | getDocTaskListResponse
  | TranslateResponse
  | FeturedSearchResponse
  | TrademarkBasicNumData

export type WindSecureApiParams =
  | getCDEFilterCfgParams
  | getCDEFilterResParams
  | getCDEIndicatorParams
  | getCorpListPresearchParams
  | getDocTaskListParams
  | GetUserPackageInfoParams
  | CreateInvestReportParams
  | TranslateParams
  | getIntellectualAggsParams

export type WindSecureApiPayload =
  | getCDEFilterCfgPayload
  | getCDEFilterResPayload
  | getCDEIndicatorPayload
  | getCorpListPresearchPayload
  | getDocTaskListPayload
  | CreateInvestReportPayload
  | TranslatePayload
  | getIntellectualAggsPayload
