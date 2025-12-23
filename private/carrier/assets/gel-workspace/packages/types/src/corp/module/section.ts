/**
 * 企业详情 带有 children 的 secion key，该 section 有可能是一级，有可能是二级，有可能是三级，在报告和企业详情的层级有可能 不同
 */
export type TCorpDetailSectionKey =
  | 'CompanyInfo' // 基础信息
  | 'Shareholder' // 股东信息
  // 企业公示
  | 'EnterprisePublicity'
  // 企业财务情况
  | 'BussData'
  // 企业财务情况-aigc
  | 'BussDataAigc'
  // 财务报表
  | 'BussDataReport'
  // 业务数据-产量
  | 'BussDataOutput'
  // 业务数据-销量
  | 'BussDataSales'
  // 业务数据-业务量
  | 'BussDataBusiness'
  // 业务数据-库存
  | 'BussDataInventory'
  // 企业融资情况 / 金融行为
  | 'FinanceInfo'
  // 经营信息
  | 'BusinessInfo'
  // 企业知识产权
  | 'IntellectualProperty'
  // 企业资质情况
  | 'Qualification'
  // 企业司法风险
  | 'JudicialRisk'
  // 企业经营风险
  | 'BusinessRisk'
  // 企业历史信息
  | 'HistoryInfo'
