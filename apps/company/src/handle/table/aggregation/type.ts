import { CorpTableCfg } from '@/types/corpDetail'
import { ISearchOptionCfg, ISearchOptionItem } from '../../../types/configDetail/search.ts'

export type IAggregationDataOption = {
  doc_count?: number
  name?: string
  key: string
  label?: string
  value: string
  count?: number
}

/**
 * 接口返回中 单项聚合的数据
 */
export interface ITableAggregationWithOption extends Omit<ISearchOptionCfg, 'options'> {
  options: (IAggregationDataOption & ISearchOptionItem)[]
  highlight?: string[] // 招投标产品词专用
}

/**
 * 聚合数据的Map格式（键值对形式）
 * 用于 searchOptionDataType = 'aggMap' 场景
 */
export interface IAggregationData {
  [key: string]: IAggregationDataOption[]
}

/**
 * 聚合数据的List格式（数组形式）
 * 用于 searchOptionDataType = 'aggList' 场景
 */
export type IAggregationList = {
  key: string
  options: {
    label: string
    value: string
    count: number
  }[]
}[]

/**
 * 根据 searchOptionDataType 返回对应的 API 响应类型
 */
export type AggregationApiResponse<T extends CorpTableCfg['searchOptionDataType'] = undefined> = T extends 'aggList'
  ? IAggregationList
  : { aggregations: IAggregationData }

/**
 * 前端用来区分的两种 聚合数据类型
 */
export type IAggResFrontType = 'aggList' | 'aggMap'
