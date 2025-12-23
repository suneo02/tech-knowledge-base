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

export type CorpTag = {
  id: string
  name: string // 标签名称
  type: CorpTagType // 标签类型
  module: CorpTagModule // 标签模块
  /**
   * 置信度 只有 INDUSTRY 模块有
   */
  confidence?: number // 置信度
}
