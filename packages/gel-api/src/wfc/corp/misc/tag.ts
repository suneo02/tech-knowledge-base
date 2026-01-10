export type CorpTagType =
  // 股票
  | 'STOCK'
  // 投资机构
  | 'INVESTMENT_INSTITUTION'
  // 集团系
  | 'GROUP_SYSTEM'
  // 企业规模
  | 'COMPANY_SCALE'
  // 所有制
  | 'OWNERSHIP'
  // 控股类型
  | 'CONTROL_TYPE'
  // 融资阶段
  | 'FINANCING_PHASE'
  // 生命周期
  | 'LIFE_CYCLE'
  // 城投公司
  | 'CITY_INVESTMENT_COMPANY'
  // 央企
  | 'STATE_ENTERPRISE'
  // IPO进程
  | 'IPO_PROGRESS'
  // 其他
  | 'OTHER'
  // 特殊名录
  | 'SPECIAL_LIST'
  // 假冒国企
  | 'FAKE_NATION_CORP'
  // 名录
  | 'LIST'
  // 产品词
  | 'PRODUCT_WORD'
  // 运营实体
  | 'OPERATOR'
  // 风控
  | 'RISK'
  // 产业
  | 'INDUSTRY'
  /* ---- 基金类别的标签 ---- */
  // 基金管理人
  | 'FUND_MANAGER'
  // 基金有限合伙人
  | 'LIMITED_PARTNER'
  // 基协备案基金
  | 'FUND_AMAC'
  // 未备案基金
  | 'FUND_NON_AMAC'
  // 连续获投
  | 'CONSECUTIVE_ROUNDS'
  // DOWN ROUND
  | 'DOWN_ROUND'

export type CorpTagModule =
  // 企业标签
  | 'CORP'
  // 所属行业/产业
  | 'INDUSTRY'
  // 企业入选名录
  | 'LIST'
  // 企业产品
  | 'PRODUCTION'
  // 风险标签
  | 'RISK'

export type CaliberConfidenceItem = {
  // 人行
  PBOC?: 1 | 2 // 1.严口径 2.宽口径
  // 金监总局
  NFSA?: 1 | 2 // 1.严口径 2.宽口径
  // 中保登
  CIR?: 1 | 2 // 1.严口径 2.宽口径
  // 理财登
  LCR?: 1 | 2 // 1.严口径 2.宽口径
}

export type CorpTag = {
  id: string
  name: string // 标签名称
  type: CorpTagType // 标签类型
  module: CorpTagModule // 标签模块
  /**
   * 置信度 只有 INDUSTRY 模块有
   */
  confidence?: number // 置信度
  caliberConfidence?: CaliberConfidenceItem // 口径数据
}
