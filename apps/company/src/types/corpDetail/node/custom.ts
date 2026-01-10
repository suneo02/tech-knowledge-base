import { CorpDetailNodeCfgCommon } from './nodeCommon'

export const CompanyDetailCustom = {
  FinancialStatements: 'FinancialStatements',
  FinancialIndicators: 'FinancialIndicators',
  HKCorpInfo: 'HKCorpInfo',
  MaskRedirect: 'MaskRedirect',
} as const
export type TCompanyDetailCustom = (typeof CompanyDetailCustom)[keyof typeof CompanyDetailCustom]

/**
 * 香港企业信息自定义节点配置
 */
export type CorpHKCorpInfoCfg = {
  custom: 'HKCorpInfo'
} & CorpDetailNodeCfgCommon

/**
 * 蒙版引流节点配置（仅展示统计数字，点击后显示蒙版并引流至其他产品）
 */
export type CorpMaskRedirectNodeCfg = {
  custom: 'MaskRedirect'
  title: string
  maskRedirect: {
    /** 跳转链接生成函数，接收企业代码返回链接 */
    url: (companyCode: string) => string | undefined
  }
} & CorpDetailNodeCfgCommon

export type CorpFinancialStatementsCfg = {
  custom: 'FinancialStatements' | 'FinancialIndicators'
} & CorpDetailNodeCfgCommon

export type CorpSubModuleCfgCustom = CorpHKCorpInfoCfg | CorpMaskRedirectNodeCfg | CorpFinancialStatementsCfg

export type CorpSubModuleCfgVipCustom = CorpHKCorpInfoCfg | CorpMaskRedirectNodeCfg | CorpFinancialStatementsCfg
