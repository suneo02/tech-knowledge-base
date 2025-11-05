export enum TagsModule {
  COMPANY = 'company', // 公司 | 投资机构
  COMPANY_PRODUCT = 'companyProduct', // 企业产品
  FEATURE_COMPANY = 'featureCompany', // 特殊企业
  STOCK = 'stock', // 股票
  GROUP = 'group', // 集团系

  RISK = 'risk', // 风险
  RANK_DICT = 'rankDict', // 名录

  TREND = 'trend', // 企业详情页 动态
  PUBLIC_SENTIMENT = 'publicSentiment', // 企业详情页 舆情
  BUSINESS_OPPORTUNITY = 'businessOpportunity', // 企业详情页 商机

  ULTIMATE_BENEFICIARY = 'ultimateBeneficiary', // 最终受益人
  ACTUAL_CONTROLLER = 'actualController', // 实际控制人
  // 关联方/一致行动人
  RELATED_PARTY = 'relatedParty', // 关联方/一致行动人
  // 是否已更名
  IS_CHANGE_NAME = 'isChangeName', // 是否已更名
  // 招投标-中标
  TENDER_WINNER = 'tenderWinner', // 中标
  // 招投标-未中标
  TENDER_LOSER = 'tenderLoser', // 未中标
}
