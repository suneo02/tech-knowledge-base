export type NewBigShareholderResult = {
  actor: string[] // 一致行动人
  annance_date: string // 公告日期
  benifciary: boolean // 是否受益人
  company_code: string // 企业编号
  holderId: string // 股东ID
  number: number // 持股数量
  proportion: number // 占已发行普通股比例
  shareholder_id: string // 股东ID
  shareholder_name: string // 股东名称
  shareholder_nameType: string // 股东名称类型
  shareholder_type: string // 股东类型
  /** 间接持股数量 */
  indirectNumber: number
}

// 结构性主体数据项接口
export interface StructuralSubjectResult {
  companyId: string // 主体ID
  controlledCompanyCode: string // 受控公司代码
  controlledCompanyId: string // 受控公司ID
  controlledCompanyName: string // 受控公司名称
  controlledCompanyRegCapital: number // 受控公司注册资本
  controlledCompanyRegCapitalUnit: string // 受控公司注册资本币种
  deadline: string // 申报期限
  state: string // 状态
  votePercent: number // VOTER百分比
}

export interface SubjectInfoResult {
  subjectId: string
  subjectName: string // 主体名称
  subjectType: '运营主体' | '上市主体' //@todo 之后富刚会改
}

export interface IndustryInfoResult {
  key: string
  name: string
  list: {
    confidence: number
    list: {
      name: string
      id: string
      url?: string
    }[]
  }[]
  total: number
}
