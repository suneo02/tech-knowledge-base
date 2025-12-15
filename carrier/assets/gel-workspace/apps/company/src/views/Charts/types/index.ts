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

// 接口传参图谱类型
export enum WIND_BDG_GRAPH_TYPE {
  EquityPenetrationChart = 'equity-penetration-chart', // 股权穿透图
  InvestmentChart = 'investment-chart', // 对外投资图
  ActualControllerChart = 'actual-controller-chart', // 实控人图谱
  BeneficiaryChart = 'beneficiary-chart', // 受益人图谱
  EnterpriseChart = 'enterprise-chart', // 企业图谱
  RelatedPartyChart = 'related-party-chart', // 关联方图谱
  SuspectedRelationChart = 'suspected-relation-chart', // 疑似关系图谱
  RelationQueryChart = 'relation-query-chart', // 查关系
  MultiToOneChart = 'multi-to-one-chart', // 多对一触达
}

// 操作区按钮类型
export enum WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE {
  SaveImage = 'saveImage', // 保存图片
  Restore = 'restore', // 还原
  Size = 'size', // 缩放
  ExportReport = 'exportReport', // 导出报告
  RemoveWaterMark = 'removeWaterMark', // 移除水印
}

// graph 外链
export enum GRAPH_LINKSOURCE {
  F9 = 'f9', // f9 单独图
  RIME = 'rime', // rime 单独图
  PCAI = 'pcai', // 企业库alice 单独图
}
