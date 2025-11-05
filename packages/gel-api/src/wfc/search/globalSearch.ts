import { QueryParams, SortParams } from '@/types'

// 中国企业搜索参数
export interface CompanySearchParams extends QueryParams, SortParams {
  creditCode?: string
  orgType?: string
  regioninfo?: string
  industryname?: string
  establishedTime?: string
  regRange?: string
  capitalType?: string
  status?: string
  corpType?: string
  endowmentNum?: string
  hasMail?: string
  hasTel?: string
  hasDomain?: string
  hasFinancing?: string
  hasIpo?: string
  hasDebt?: string
  hasBidding?: string
  hasOnList?: string
  hasBrand?: string
  hasPatent?: string
  hasPledge?: string
  hasBreakPromise?: string
  hasTaxRating?: string
  hasImportExport?: string
  hasProductionCopyright?: string
  hasCopyright?: string
  listStatus?: string
}

// 全球企业搜索参数
export interface GlobalCompanySearchParams extends QueryParams, SortParams {
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

// 企业基础信息
export interface CompanyBaseInfo {
  companyCode: string // 企业编号
  companyName: string // 企业名称
  creditCode: string // 统一社会信用代码
  regCapital: string // 注册资本
  regDate: string // 成立日期
  status: string // 经营状态
  legalPerson: string // 法定代表人
  address: string // 注册地址
  industry: string // 所属行业
  orgType: string // 机构类型
  regAuthority: string // 登记机关
  approvedDate: string // 核准日期
  businessScope: string // 经营范围
  district: string // 行政区划
  phone: string // 联系电话
  email: string // 联系邮箱
  website: string // 网址
  hasAbnormal: boolean // 是否有经营异常
  hasCaseInfo: boolean // 是否有立案信息
  hasEquityPledge: boolean // 是否有股权出质
  hasMortgage: boolean // 是否有动产抵押
}

// 中国企业搜索结果
export interface CompanySearchResult {
  list: CompanyBaseInfo[]
  total: number
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
