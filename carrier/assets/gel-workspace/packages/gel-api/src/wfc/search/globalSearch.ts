import { CorpSearchQueryParams, CorpSearchSortParams } from '@/types'

// 全球企业搜索参数
export interface GlobalCompanySearchParams extends CorpSearchQueryParams, CorpSearchSortParams {
  areaType?: string
}

// 统计数字查询参数
export interface SearchNumParams {
  queryText: string
  tabs?: Array<'group' | 'bidding' | 'IP' | 'person'>
}

// 统计数字响应
export interface SearchNumResponse {
  group: string
  bidding: string
  IP: string
  person: string
}

export interface CompanybrowsehistorylistParams {
  pageSize: number
}

export interface CompanybrowsehistorylistResult {
  entityId: string
  entityName: string
  subType: number
  type: number
}

// 全球企业基础信息
export interface GlobalCompanyBaseInfo {
  companyCode: string // 企业编号
  companyName: string // 企业名称
  nativeName: string // 本地语言名称
  englishName: string // 英文名称
  countryCode: string // 国家代码
  countryName: string // 国家名称
  establishDate: string // 成立日期
  status: string // 经营状态
  companyType: string // 企业类型
  regNumber: string // 注册号
  regAuthority: string // 登记机关
  address: string // 注册地址
  businessScope: string // 经营范围
  website: string // 网址
  phone: string // 联系电话
  email: string // 联系邮箱
  hasAnnualReport: boolean // 是否有年报
  hasFinancial: boolean // 是否有财务数据
  hasBranch: boolean // 是否有分支机构
  hasInvestment: boolean // 是否有对外投资
}

// 全球企业搜索结果
export interface GlobalCompanySearchResult {
  list: GlobalCompanyBaseInfo[]
  total: number
}

export interface CompanybrowsehistoryaddParams {
  entityId: string
}

export interface CompanybrowsehistorydeleteoneParams {
  entityId: string
}
