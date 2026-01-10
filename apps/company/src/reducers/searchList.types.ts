/**
 * SearchList Reducer 类型定义
 */
import type { BidItem, PatentItemFront, PersonItem } from 'gel-types'

// ======== State 类型定义 ========

export interface SearchListState {
  companySearchList?: any[]
  companySearchErrorCode?: string
  companyView?: any[] | string
  companyViewHot?: any[]
  groupList?: any[] | string
  groupListErrorCode?: string
  groupViewHot?: any[]
  personList?: PersonItem[]
  personListErrorCode?: string
  personView?: any[]
  overseaSearchList?: any[]
  overseaSearchListErrorCode?: string
  jobList?: any[] | string
  jobListErrorCode?: string
  jobView?: any[]
  jobHotView?: any[]
  intelluctalList?: PatentItemFront[]
  intelluctalErrorCode?: string
  intelluctalViewList?: any[]
  patentSecondType?: PatentAggregation[]
  patentType?: string
  brandState?: string
  brandType?: string
  bidSearchList?: BidItem[]
  bidErrorCode?: string
  bidViewList?: any[]
  searchKeyWord?: string
  outCompanySearchList?: any[] | string
  outCompanySearchErrorCode?: string
  outCompanyView?: any[]
  collectList?: any[]
  globalSearchTimeStamp?: number
}

// ======== Action 类型定义 ========

interface BaseAction<T extends string, P = any> {
  type: T
  data: P
}

// 人物搜索相关 Actions
export type SearchPersonAction = BaseAction<
  'SEARCH_PERSON',
  {
    code: string
    ErrorCode: string
    data?: PersonItem[]
    Page?: {
      Records: number
      CurrentPage: number
    }
  }
>

export interface UpdatePersonTranslationAction {
  type: 'UPDATE_PERSON_TRANSLATION'
  data: {
    translatedData: PersonItem[]
  }
}

// 招投标搜索相关 Actions
export type SearchBidAction = BaseAction<
  'SEARCH_BID',
  {
    code: string
    ErrorCode: string
    data?: {
      list: BidItem[]
    }
    Page?: {
      Records: number
      CurrentPage: number
    }
  }
>

export interface UpdateBidTranslationAction {
  type: 'UPDATE_BID_TRANSLATION'
  data: {
    translatedData: BidItem[]
  }
}

// 专利翻译更新 Action
export interface UpdatePatentTranslationAction {
  type: 'UPDATE_PATENT_TRANSLATION'
  data: {
    translatedData: {
      list: PatentItemFront[]
      aggregations?: {
        agg_patentClassification?: PatentAggregation[]
      }
    }
  }
}

// 企业搜索相关 Actions
export type SearchCompanyAction = BaseAction<
  'SEARCH_COMPANY',
  {
    code: string
    ErrorCode: string
    data?: {
      search?: any[]
    }
    pageNo: number
  }
>

// 全局搜索关键词
export type SetGlobalSearchKeywordAction = BaseAction<'SET_GLOBAL_SEARCH_KEYWORD', string>

// 全局搜索时间戳
export type SetGlobalSearchTimestampAction = BaseAction<'SET_GLOBAL_SEARCH_TIMESTAMP', number>

// 其他 Actions（细化 type，data 保持 any）
export type OtherSearchListAction =
  | BaseAction<'HOT_VIEW_GROUP', any>
  | BaseAction<'HOT_VIEW_COMPANY', any>
  | BaseAction<'CLEAR_VIEW', any>
  | BaseAction<'VIEW_COMPANY', any>
  | BaseAction<'VIEW_PERSON', any>
  | BaseAction<'COLLECT_CLIST', any>
  | BaseAction<'SEARCH_GROUP', any>
  | BaseAction<'SEARCH_GLOBALWORLD', any>
  | BaseAction<'SEARCH_JOB', any>
  | BaseAction<'VIEW_JOB', any>
  | BaseAction<'HOT_VIEW_JOB', any>
  | BaseAction<'SEARCH_INTELLECTUAL', any>
  | BaseAction<'SEARCH_PATENT', any>
  | BaseAction<'VIEW_INTELLECTUAL', any>
  | BaseAction<'CLEAR_FILTER', any>
  | BaseAction<'SEARCH_OUTCOMPANY', any>
  | BaseAction<'VIEW_OUTCOMPANY', any>

// 联合所有 SearchList Action 类型
export type SearchListAction =
  | SearchPersonAction
  | UpdatePersonTranslationAction
  | SearchBidAction
  | UpdateBidTranslationAction
  | UpdatePatentTranslationAction
  | SearchCompanyAction
  | SetGlobalSearchKeywordAction
  | SetGlobalSearchTimestampAction
  | OtherSearchListAction
// 聚合项类型（用于专利分类聚合展示）
export interface PatentAggregation {
  key: string
  key_en?: string
  [key: string]: any
}
