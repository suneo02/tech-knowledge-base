// 基础信息
type BaseInfoType = '股东变更' | '企业公告' | '对外投资' | '专利信息' | '工商变更'

// 金融行为
type FinanceType = 'PEVC融资' | '并购事件' | '投资事件' | '动产融资' | '动产抵押'

// 经营状况
type BusinessType = '招投标公告' | '上榜信息' | '招聘信息'

// 法律诉讼
type LegalType = '裁判文书' | '法院公告' | '开庭公告'

// 知识产权
type IPType = '商标信息' | '作品著作权' | '软件著作权'

// 事件状态
type EventStatus = '退出' | '新增' | '变动' | '持股变更' | '初始登记' | '变更登记'

// 合并所有类型
export type CorpEventType = BaseInfoType | FinanceType | BusinessType | LegalType | IPType

export interface CorpEvent {
  _id: string
  caseReason: string
  corpId: string[]
  corp_id: string
  corp_id_name: string
  corp_name: string
  ent_log?: string
  eventAbstract: string
  event_abstract: Record<string, any>
  event_category: string
  event_date: string
  event_id: string
  event_source_id: string
  event_type: CorpEventType
  event_status?: EventStatus
  event_describe?: Record<string, any>
  role?: string
}
