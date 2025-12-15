import {
  CompanybrowsehistoryaddParams,
  CompanybrowsehistorydeleteoneParams,
  CompanybrowsehistorylistParams,
  CompanybrowsehistorylistResult,
  CompanySearchParams,
  CompanySearchResult,
  GlobalCompanySearchParams,
  GlobalCompanySearchResult,
  SearchHistory,
  SearchHistoryType,
  SearchNumParams,
  SearchNumResponse,
} from 'gel-api'
import type { ApiResponse } from '../types'

// 最近浏览相关类型定义
export interface GroupBrowseHistoryItem {
  entityId: string
  entityName: string
  parameter?: string // 公司id，人物有公司
  parameterName?: string
}

export interface GroupBrowseHistoryAddParams {
  entityId: string
  entityName: string
}

export interface GroupBrowseHistoryDeleteOneParams {
  entityId: string
}

export interface PersonBrowseHistoryAddParams {
  entityId: string
  parameter: string
}

export interface PersonBrowseHistoryDeleteOneParams {
  entityId: string
  parameter: string
}

// 搜索相关API路径定义
export type SearchApiPaths = {
  // 中国企业搜索
  'search/company/getCompanySearchFullMatch': {
    params: CompanySearchParams
    response: ApiResponse<CompanySearchResult>
  }
  'search/company/getCompanySearchPartMatch': {
    params: CompanySearchParams
    response: ApiResponse<CompanySearchResult>
  }
  '/search/company/getGlobalCompanyPreSearch': {
    params: CompanySearchParams
    response: ApiResponse<CompanySearchResult>
  }
  // 全球企业搜索
  'search/company/getGlobalCompanySearchFullMatch': {
    params: GlobalCompanySearchParams
    response: ApiResponse<GlobalCompanySearchResult>
  }
  'search/company/getGlobalCompanySearchPartMatch': {
    params: GlobalCompanySearchParams
    response: ApiResponse<GlobalCompanySearchResult>
  }
  // 统计数字
  'search/company/getSearchNum': {
    params: SearchNumParams
    response: ApiResponse<SearchNumResponse>
  }
  // 增加浏览记录
  'operation/insert/companybrowsehistoryadd': {
    params: CompanybrowsehistoryaddParams
    response: ApiResponse<any>
  }
  // 删除企业浏览记录
  'operation/delete/companybrowsehistorydeleteone': {
    params: CompanybrowsehistorydeleteoneParams
    response: ApiResponse<any>
  }
  // 清空企业浏览记录
  'operation/delete/companybrowsehistorydeleteall': {
    params: any
    response: ApiResponse<any>
  }
  // 查询企业浏览记录
  'operation/get/companybrowsehistorylist': {
    params: CompanybrowsehistorylistParams
    response: ApiResponse<CompanybrowsehistorylistResult[]>
  }
  'operation/get/getHotCompany': {
    params: undefined
    response: ApiResponse<
      {
        id: string
        name: string
      }[]
    >
  }
  // 删除搜索历史
  'operation/delete/searchhistorydeleteall': {
    params: {
      type: SearchHistoryType
    }
    response: ApiResponse<any>
  }
  // 删除单个搜索历史
  'operation/delete/searchhistorydeleteone': {
    params: {
      type: SearchHistoryType
      searchKey: string
    }
    response: ApiResponse<any>
  }
  // 获取搜索历史
  'operation/get/searchhistorylist': {
    params: {
      type: SearchHistoryType
    }
    response: ApiResponse<SearchHistory>
  }
  // 添加搜索历史
  'operation/insert/searchhistoryadd': {
    params: {
      type: SearchHistoryType
      searchKey: string
    }
    response: ApiResponse<any>
  }
  // 获取最近浏览列表
  'operation/get/groupbrowsehistorylist': {
    params: undefined
    response: ApiResponse<GroupBrowseHistoryItem[]>
  }
  // 添加最近浏览记录
  'operation/insert/groupbrowsehistoryadd': {
    params: GroupBrowseHistoryAddParams
    response: ApiResponse<any>
  }
  // 删除单个最近浏览记录
  'operation/delete/groupbrowsehistorydeleteone': {
    params: GroupBrowseHistoryDeleteOneParams
    response: ApiResponse<any>
  }
  // 清空所有最近浏览记录
  'operation/delete/groupbrowsehistorydeleteall': {
    params: undefined
    response: ApiResponse<any>
  }
  // 获取人物最近浏览列表
  'operation/get/personbrowsehistorylist': {
    params: undefined
    response: ApiResponse<GroupBrowseHistoryItem[]>
  }
  // 添加人物最近浏览记录
  'operation/insert/personbrowsehistoryadd': {
    params: PersonBrowseHistoryAddParams
    response: ApiResponse<any>
  }
  // 删除单个人物最近浏览记录
  'operation/delete/personbrowsehistorydeleteone': {
    params: PersonBrowseHistoryDeleteOneParams
    response: ApiResponse<any>
  }
  // 清空所有人物最近浏览记录
  'operation/delete/personbrowsehistorydeleteall': {
    params: undefined
    response: ApiResponse<any>
  }
}
