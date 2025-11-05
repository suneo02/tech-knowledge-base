import { TrademarkBasicNumData, UserPackageInfo } from 'gel-types'
import {
  CDEFilterCategory,
  CDEFilterResResponse,
  CDEIndicatorItem,
  getCDEFilterCfgParams,
  getCDEFilterCfgPayload,
  getCDEFilterResParams,
  getCDEFilterResPayload,
  getCDEIndicatorParams,
  getCDEIndicatorPayload,
  getCorpListPresearchParams,
  getCorpListPresearchPayload,
  getCorpListPresearchResponse,
} from './CDE'
import { getIntellectualAggsParams, getIntellectualAggsPayload } from './corp'
import { getDocTaskListParams, getDocTaskListPayload, getDocTaskListResponse } from './docTask'
import { TranslateParams, TranslatePayload, TranslateResponse } from './misc'
import { CreateInvestReportParams, CreateInvestReportPayload } from './report'
import { FeturedSearchResponse } from './search'
import { GetUserPackageInfoParams } from './user'

export * from './CDE'
export * from './config'
export * from './corp'
export * from './docTask'
export * from './search'
export * from './user'

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
