// 将枚举值转换为字符串字面量类型，用于JSON配置

export type ConfigTableCellCustomRenderNameLiteral =
  // 信用代码的部分内容，如组织机构代码等
  | 'creditCodePart'
  // 国民经济行业分类信息的特殊渲染
  | 'industryGbFold'
  // 战略性新兴产业分类信息的特殊渲染
  | 'xxIndustry'
  // 曾用名信息的特殊渲染
  | 'usedNames'
  // 香港企业企业名称
  | 'hkCorpName'
  // 香港企业曾用名
  | 'hkUsedNames'
  // 海外企业别名
  | 'overseasAlias'
  // 海外企业经营范围
  | 'overseasBusinessScope'
  // 工商信息经营状态
  | 'bussStatus'
  // 公告披露-股东名称-包括多个标签
  | 'announcementShareholderName'
  // 工商登记股东名称
  | 'bussInfoShareholderName'
  // 股票涨跌幅
  | 'stockChange'
  // 工商变更信息
  | 'bussChangeInfo'
  // 债项/主体评级
  | 'bondIssueRating'
  // 诚信信息-处罚状态
  | 'integrityPenaltyStatus'
  // 日期期限，同时在一个字段中 用 - 分割
  | 'dateRangeInOneField'
