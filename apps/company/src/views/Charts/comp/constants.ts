import { WIND_BDG_GRAPH_TYPE } from '@/api/graph'

// 菜单类型枚举
export enum GRAPH_MENU_TYPE {
  // 股权类图谱
  EQUITY_PENETRATION = 'chart_gqct', // 股权穿透图
  INVESTMENT = 'chart_newtzct', // 对外投资图
  ACTUAL_CONTROLLER = 'detach_ctrl', // 实控人图谱
  BENEFICIARY_OWNER = 'detach_beneficiaryOwner', // 受益所有人
  BENEFICIARY_PERSON = 'detach_beneficiaryPerson', // 受益自然人
  BENEFICIARY_ORG = 'detach_beneficiaryOrg', // 受益机构

  // 关系类图谱
  ACCOUNTING_STANDARDS = 'relate_accountingStandards', // 企业会计准则
  SSSE_RULES = 'relate_ssseRules', // 上交所规则
  SZSE_RULES = 'relate_szseRules', // 深交所规则
  CBIRC_RULES = 'relate_cbircRules', // 银保监规则
  ENTERPRISE = 'chart_qytp', // 企业图谱
  SUSPECTED_RELATION = 'force', // 疑似关系

  // 融资类图谱
  FINANCING = 'chart_rztp', // 融资图谱
  FINANCING_HISTORY = 'chart_rzlc', // 融资历程

  // 查关系
  RELATION_QUERY = 'detach_relation', // 查关系
  MULTI_TO_ONE = 'detach_multiToOne', // 多对一触达
  SHAREHOLDING_PATH = 'chart_cglj', // 持股路径
}

// 需要映射到API的菜单类型
export type GraphMenuTypeWithApi =
  | GRAPH_MENU_TYPE.SUSPECTED_RELATION
  | GRAPH_MENU_TYPE.RELATION_QUERY
  | GRAPH_MENU_TYPE.MULTI_TO_ONE
  | GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS
  | GRAPH_MENU_TYPE.SSSE_RULES
  | GRAPH_MENU_TYPE.SZSE_RULES
  | GRAPH_MENU_TYPE.CBIRC_RULES
  | GRAPH_MENU_TYPE.BENEFICIARY_OWNER
  | GRAPH_MENU_TYPE.BENEFICIARY_PERSON
  | GRAPH_MENU_TYPE.BENEFICIARY_ORG
  | GRAPH_MENU_TYPE.ACTUAL_CONTROLLER

// 菜单类型到API类型的映射
export const WIND_BDG_GRAPH_MENU_TO_TYPE: Record<GraphMenuTypeWithApi, WIND_BDG_GRAPH_TYPE> = {
  [GRAPH_MENU_TYPE.SUSPECTED_RELATION]: WIND_BDG_GRAPH_TYPE.SuspectedRelationChart,
  [GRAPH_MENU_TYPE.RELATION_QUERY]: WIND_BDG_GRAPH_TYPE.RelationQueryChart,
  [GRAPH_MENU_TYPE.MULTI_TO_ONE]: WIND_BDG_GRAPH_TYPE.MultiToOneChart,
  [GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS]: WIND_BDG_GRAPH_TYPE.RelatedPartyChart,
  [GRAPH_MENU_TYPE.SSSE_RULES]: WIND_BDG_GRAPH_TYPE.RelatedPartyChart,
  [GRAPH_MENU_TYPE.SZSE_RULES]: WIND_BDG_GRAPH_TYPE.RelatedPartyChart,
  [GRAPH_MENU_TYPE.CBIRC_RULES]: WIND_BDG_GRAPH_TYPE.RelatedPartyChart,
  [GRAPH_MENU_TYPE.BENEFICIARY_OWNER]: WIND_BDG_GRAPH_TYPE.BeneficiaryChart,
  [GRAPH_MENU_TYPE.BENEFICIARY_PERSON]: WIND_BDG_GRAPH_TYPE.BeneficiaryChart,
  [GRAPH_MENU_TYPE.BENEFICIARY_ORG]: WIND_BDG_GRAPH_TYPE.BeneficiaryChart,
  [GRAPH_MENU_TYPE.ACTUAL_CONTROLLER]: WIND_BDG_GRAPH_TYPE.ActualControllerChart,
} as const

//关联关系图谱API类型
export const RELATE_CHART_API_TYPE = {
  [GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS]: 4, // 企业会计准则
  [GRAPH_MENU_TYPE.SSSE_RULES]: 2, // 上交所规则
  [GRAPH_MENU_TYPE.SZSE_RULES]: 3, // 深交所规则
  [GRAPH_MENU_TYPE.CBIRC_RULES]: 5, //银保监规则
} as const
