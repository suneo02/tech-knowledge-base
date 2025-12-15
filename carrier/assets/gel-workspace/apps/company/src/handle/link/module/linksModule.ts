/**
 * 这个不能改 value json 中有没调用该module
 * ！！！
 */
export enum LinksModule {
  COMPANY = 1,
  GROUP = 2, // 集团系
  CHARACTER = 3,

  FEATURED = 4, // 特色企业名录
  FEATURED_LIST = 5, // 榜单名录列表
  DATA_BROWSER = 6, // 企业数据浏览器
  JOB = 8, // 招聘
  PRODUCT = 9, // 产品
  RISK = 10, // RiskTypeEnum
  /**
   * @deprecated 待拆分为更小的模块
   */
  INTELLECTUAL = 11, // 知识产权
  USER = 12, // 用户中心
  SEARCH = 13, // 综合查询
  HOME = 14, // 首页 2025-01-20 新增
  SPECIAL_CORP = 15, // 特色企业列表 !这个格式不对
  KG = 16, // 图谱平台
  VIP = 17,

  /**
   * @deprecated 待拆分为更小的模块
   */
  MISC_DETAIL = 18, // 一些其他的详情页

  BID = 19, // 招投标
  STANDARD_DETAIL = 20, // 标准信息
  PATENT = 21, // 专利
  QUALIFICATION_HOME = 22, // 资质大全
  QUALIFICATION_DETAIL = 23, // 资质详情
  COMPANY_DYNAMIC = 24, // 单个企业动态
  COMPANY_DYNAMIC_ALL = 26, // 收藏企业动态 需加?keyMenu=2

  /**
   * 上线后去除
   *
   * @deprecated
   */
  HOMEAI = 25, // AI 首页
  CompanyDetailAI = 27, // 企业详情 AI

  IC_LAYOUT = 28, // 集成电路布图
  SUPER_LIST = 88, // 超级名单

  ANNUAL_REPORT = 97, // 企业年度报告

  GRAPH_AI = 29, // 图谱 AI

  LOGIN = 101, // 登录

  /**
   * gel web 端 链接
   */
  WEB = 100,

  CompanyNew = 'companyNew',

  SCENARIO_APPLICATION = 'ScenarioApplicationLinkEnum', // 场景应用

  REPORT_HOME = 'ReportHome', // 报告平台
}
