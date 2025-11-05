import { CDEFilterItem, CDEFilterOption, CDELogicOptionValue } from './getFilterCfg'
import { CDEIndicatorField } from './getIndicator'

export type CDERankQueryFilterValue = {
  objectName: string
  objectId: string
  objectDate?: string // Date information (if applicable)
  objectYear?: string | number // Year information (if applicable)
} & Partial<CDEFilterOption> &
  Pick<CDEFilterItem, 'selfDefine' | 'itemRemark'>

interface QueryFilter {
  field: string
  itemId: number
  title: string
  logic?: CDELogicOptionValue
  // 查询数据的 value 必须是 []，如果只有一个 value，则需要包装成数组

  value: string | string[] | CDERankQueryFilterValue[]
  /**
   * 榜单名录查询会用到这个
   *
   * @deprecated
   */
  search?: string[] | CDERankQueryFilterValue[]
}

/**
 * 前端使用的类指标，及查询数据的入参
 */

export type CDEMeasureField = CDEIndicatorField | 'corp_id' | 'corp_name'

export interface CDEMeasureItem {
  field: CDEMeasureField
  title: string
}

/**
 * CDE 查询数据用到的逻辑
 */
export interface CDESuperQueryLogic {
  filters: QueryFilter[]
  measures: CDEMeasureItem[]
}

export interface getCDEFilterResParams {
  cmd: 'getcrossfilter2'
}
export interface getCDEFilterResPayload {
  pageNum: number
  pageSize: number
  superQueryLogic: CDESuperQueryLogic
  order: null
  largeSearch: boolean
  fromTemplate: boolean
}

export type CDEFilterResItem = {
  [K in CDEMeasureField]?: string
} & {
  oper_period_begin?: string
}

export type CDEFilterResResponse = {
  data: CDEFilterResItem[]
  largeSearch: boolean
  pageNum: number
  pageSize: number
  total: number
}
