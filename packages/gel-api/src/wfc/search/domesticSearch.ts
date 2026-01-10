import { CorpSearchQueryParams, CorpSearchSortParams } from '@/types'
import { CorpTag } from '../corp'

// 中国企业搜索参数
export interface CompanySearchParams extends CorpSearchQueryParams, CorpSearchSortParams {
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

// 企业标签信息
export interface CorporationTag {
  id: string // 标签ID
  title: string // 标签标题
  type: number // 标签类型
}

// 高亮信息
export interface HighlightInfo {
  isDisplayedInList: number // 是否在列表中显示
  label: string // 标签名称
  value: string // 高亮值
}

// 企业基础信息
export interface CompanyInfoInSearch {
  aiTransFlag: boolean // AI翻译标志
  capitalUnit: string // 资本单位
  highlight: HighlightInfo[] // 高亮信息
  orgType: string // 机构类型
  corpOldId: string // 企业旧ID
  registrationAuthority: string // 登记机关
  province: string // 省份
  domesticEntity: string // 境内实体
  areaType: string // 区域类型
  logo: string // 企业logo
  /**
   * @deprecated 企业标签
   * 企业标签
   */
  corporationTags3?: string[]
  /** 企业标签 */
  tags: CorpTag[]
  /** 境内运营实体 */
  industryName: string // 行业名称
  bizRegNo: string // 营业执照号
  artificialPersonType: string // 法人类型
  areaCn: string // 中文区域
  corpId: string // 企业ID
  corpNameEng: string // 企业英文名称
  corpName: string // 企业名称（原始名称）
  corpNameTrans?: string // 企业翻译名称
  corpNameAITransFlag?: boolean // 企业 AI 翻译标志
  establishDate: string // 成立日期
  registerAddress: string // 注册地址
  areaCode: string // 区域代码
  registerCapital: string // 注册资本
  artificialPersonId: string // 法人ID
  statusAfter: string // 经营状态
  artificialPersonName: string // 法人姓名
  domesticEntityId: string // 境内运营实体ID
}

// 中国企业搜索结果
export interface CompanySearchResult {
  search: CompanyInfoInSearch[]
  total: number
}
