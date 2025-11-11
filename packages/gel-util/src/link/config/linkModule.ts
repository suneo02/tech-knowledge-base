/**
 * 这个不能改 value json 中有没调用该module
 * ！！！
 */
export enum LinkModule {
  GROUP = 'GROUP', // 集团系

  /** 搜索系列 */
  SEARCH_HOME = 'SEARCH_HOME', // 搜索首页 全球企业库主搜索页面
  GLOBAL_SEARCH = 'GLOBAL_SEARCH', // 全球企业搜索
  GROUP_SEARCH = 'GROUP_SEARCH', // 集团系搜索
  BID_SEARCH = 'BID_SEARCH', // 招投标搜索
  JOB_SEARCH = 'JOB_SEARCH', // 招聘搜索
  PATENT_SEARCH = 'PATENT_SEARCH', // 专利搜索
  TRADEMARK_SEARCH = 'TRADEMARK_SEARCH', // 商标搜索
  CDE_SEARCH = 'CDE_SEARCH', // 企业数据浏览器 搜索页
  FEATURED_SEARCH = 'FEATURED_SEARCH', // 特色企业 名录 搜索页

  // =====  特色企业   =====
  /** 榜单名录 */
  FEATURED_COMPANY = 'FEATURED_COMPANY',
  /** 特色企业模块，包含 央企国企、发债企业、金融机构、PEVC被投企业、上市企业、企业资质大全 */
  SPECIAL_LIST = 'SPECIAL_LIST',
  /** 企业资质大全 */
  QUALIFICATIONS = 'QUALIFICATIONS',

  /** 关联链接模块 包含 重点园区、新企发现、批量查询导出 */
  RELATED_LINK = 'RELATED_LINK',

  /** VIP中心 */
  VIP_CENTER = 'VIP_CENTER',

  /** 报告平台 */
  REPORT_PLATFORM = 'REPORT_PLATFORM',

  /** iframe 嵌套的页面 */
  INNER_PAGE = 'INNER_PAGE',

  GQCT_CHART = 'KG_GQCT', // 股权穿透图 非图谱平台，只是用于iframe 嵌套
  BENEFICIAL_CHART = 'KG_BENEFICIAL', // 受益人图谱 非图谱平台，只是用于iframe 嵌套
  CORRELATION_CHART = 'KG_CORRELATION', // 关联方图谱 非图谱平台，只是用于iframe 嵌套
  ACTUAL_CONTROLLER_CHART = 'KG_ACTUAL_CONTROLLER', // 实际控制人图谱 非图谱平台，只是用于iframe 嵌套

  COMPANY_DETAIL = 'COMPANY_DETAIL', // 企业详情
  WINDCODE_2_F9 = 'WINDCODE_2_F9', // windcode 跳转 f9

  KG_PLATFORM = 'KG_PLATFORM', // 图谱平台
  USER_CENTER = 'USER_CENTER', // 用户中心
  DDRP_PREVIEW = 'DDRP_PREVIEW', // 尽职调查报告预览
  DDRP_PRINT = 'DDRP_PRINT', // 尽职调查报告打印
  CREDIT_RP_PREVIEW = 'CREDIT_RP_PREVIEW', // 企业深度信用调查报告预览
  CREDIT_RP_PRINT = 'CREDIT_RP_PRINT', // 企业深度信用调查报告打印

  AI_CHAT = 'AI_CHAT', // AI 聊天
  AI_REPORT_HOME = 'AI_REPORT_HOME', // AI 报告首页
  AI_REPORT_OUTLINE_CHAT = 'AI_REPORT_OUTLINE_CHAT', // AI 报告大纲聊天
  AI_REPORT_DETAIL = 'AI_REPORT_DETAIL', // AI 报告详情

  /** SUPER */
  SUPER = 'SUPER', // 超级名单首页

  SUPER_LIST_CHAT = 'SUPER_LIST_CHAT', // 超级名单聊天详情

  SUPER_DOWNLOAD = 'SUPER_DOWNLOAD', // 超级名单下载

  CREDIT = 'CREDIT', // 积分中心

  COMPANY_DYNAMIC = 'COMPANY_DYNAMIC', // 企业动态

  SEARCH = 'SEARCH', // 全球企业搜索列表页

  // 万寻地图
  WANXUN_MAP = 'WANXUN_MAP',

  // EAPI
  EAPI = 'EAPI',
}
