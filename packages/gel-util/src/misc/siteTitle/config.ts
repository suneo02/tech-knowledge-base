import type { TIntl } from '../../types/intl'

export const getSiteDefaultTitle = (t: TIntl): string => t('406815', 'Wind全球企业库')
export const DEFAULT_SITE_TITLE_WEB_CN = 'Wind全球企业库 - 企业信息与信用查询平台'

export const getPageTitleMap = {
  // 企业API
  EAPIHome: (t: TIntl) => `企业API-${getSiteDefaultTitle(t)}`,
  // 企业API-全部列表
  EAPIList: (t: TIntl) => `企业API-${getSiteDefaultTitle(t)}`,
  // 我的API
  MyAPI: (t: TIntl) => `企业API-${getSiteDefaultTitle(t)}`,
  // 企业API-搜索结果
  EAPISearchResults: (t: TIntl) => `企业API-${getSiteDefaultTitle(t)}`,
  // 企业API-详情
  APIDetail: (t: TIntl) => `{API名称}-企业API-${getSiteDefaultTitle(t)}`,
  // 帮助文档
  HelpDocs: (t: TIntl) => `企业API-${getSiteDefaultTitle(t)}`,
  // 企业详情
  CompanyDetail: (t: TIntl) => `{公司名}-${getSiteDefaultTitle(t)}`,
  // 企业库首页
  CompanyHome: (t: TIntl) => getSiteDefaultTitle(t),
  // 企业库主搜索
  CompanyMainSearch: (t: TIntl) => getSiteDefaultTitle(t),
  // 集团系详情
  GroupDetail: (t: TIntl) => `{集团系名称}-${getSiteDefaultTitle(t)}`,
  // 榜单名录首页
  RankHome: (t: TIntl) => `${t('259148', '企业榜单名录')}-${getSiteDefaultTitle(t)}`,
  // 榜单名录列表
  RankList: (t: TIntl) => `${t('259148', '企业榜单名录')}-${getSiteDefaultTitle(t)}`,
  // 榜单名录详情
  RankListDetail: (t: TIntl) => `{榜单名录名称}-${getSiteDefaultTitle(t)}`,
  // 特色企业-上市企业
  FeaturedListed: (t: TIntl) => `${t('142006', '上市企业')}-${getSiteDefaultTitle(t)}`,
  // 特色企业-发债企业
  FeaturedBonds: (t: TIntl) => `${t('220263', '发债企业')}-${getSiteDefaultTitle(t)}`,
  // 特色企业-央企国企
  FeaturedStateOwned: (t: TIntl) => `${t('252985', '央企国企')}-${getSiteDefaultTitle(t)}`,
  // 特色企业-金融机构
  FeaturedFinance: (t: TIntl) => `${t('314124', '金融机构')}-${getSiteDefaultTitle(t)}`,
  // 特色企业-PEVC被投企业
  FeaturedPEVC: (t: TIntl) => `${t('265623', 'PEVC被投企业')}-${getSiteDefaultTitle(t)}`,
  // VIP服务
  VIPServices: (t: TIntl) => `${t('222403', 'VIP服务')}-${getSiteDefaultTitle(t)}`,
  // 招投标查询
  TenderSearch: (t: TIntl) => `${t('303419', '查招投标')}-${getSiteDefaultTitle(t)}`,
  // 招投标详情
  TenderDetail: (t: TIntl) => `{招投标公告名称}-${getSiteDefaultTitle(t)}`,
  // 专利查询
  PatentSearch: (t: TIntl) => `${t('203989', '查专利')}-${getSiteDefaultTitle(t)}`,
  // 专利详情
  PatentDetail: (t: TIntl) => `{专利名称}-${getSiteDefaultTitle(t)}`,
  // 商标查询
  TrademarkSearch: (t: TIntl) => `${t('203988', '查商标')}-${getSiteDefaultTitle(t)}`,
  // 商标详情
  TrademarkDetail: (t: TIntl) => `{商标名称}-${getSiteDefaultTitle(t)}`,
  // 资质大全首页
  QualificationsHome: (t: TIntl) => `${t('364555', '资质大全')}-${getSiteDefaultTitle(t)}`,
  // 资质大全详情
  QualificationsDetail: (t: TIntl) => `${t('364555', '资质大全')}-${getSiteDefaultTitle(t)}`,
  // 招聘查询
  JobSearch: (t: TIntl) => `${t('379753', '查招聘')}-${getSiteDefaultTitle(t)}`,
  // 招聘详情
  JobDetail: (t: TIntl) => `{公司名}${t('138356', '招聘')}{职位名称}-${getSiteDefaultTitle(t)}`,
  // 企业数据浏览器-结果列表
  DataBrowserList: (t: TIntl) => `${t('259750', '企业数据浏览器')}-${getSiteDefaultTitle(t)}`,
  // 企业数据浏览器首页
  DataBrowserHome: (t: TIntl) => `尽调平台-${getSiteDefaultTitle(t)}`,
  // 批量查询导出
  BulkQueryExport: (t: TIntl) => `${t('208389', '批量查询导出')}-${getSiteDefaultTitle(t)}`,
  // 企业动态
  CompanyNews: (t: TIntl) => `${t('370254', '企业动态')}-${getSiteDefaultTitle(t)}`,
  // 开庭公告详情
  CourtNoticeDetail: (t: TIntl) => `{案号}{案由}-${getSiteDefaultTitle(t)}`,
  // 限制高消费详情
  HighConsumptionRestrictions: (t: TIntl) => `{案号}${t('209064', '限制高消费')}-${getSiteDefaultTitle(t)}`,
  // 裁判文书详情
  JudgmentDetails: (t: TIntl) => `{案件标题}-${getSiteDefaultTitle(t)}`,
  // 法院公告详情
  CourtAnnouncementDetails: (t: TIntl) => `{案号}{案由}-${getSiteDefaultTitle(t)}`,
  // 送达公告详情
  DeliveryNoticeDetails: (t: TIntl) => `{案号}{案由}-${getSiteDefaultTitle(t)}`,
  // 用户中心-我的账号
  UserCenterAccount: (t: TIntl) => `${t('210156', '用户中心')}-${getSiteDefaultTitle(t)}`,
  // 用户中心-我的数据
  UserCenterData: (t: TIntl) => `${t('141995', '我的数据')}-${getSiteDefaultTitle(t)}`,
  // 用户中心-我的订单
  UserCenterOrders: (t: TIntl) => `${t('153389', '我的订单')}-${getSiteDefaultTitle(t)}`,
  // 用户中心-用户协议
  UserCenterAgreement: (t: TIntl) => `${t('452995', '用户协议')}-${getSiteDefaultTitle(t)}`,
  // 用户中心-隐私政策
  UserCenterPrivacy: (t: TIntl) => `${t('242146', '隐私政策')}-${getSiteDefaultTitle(t)}`,
  // 用户中心-免责声明
  UserCenterDisclaimer: (t: TIntl) => `${t('23348', '免责声明')}-${getSiteDefaultTitle(t)}`,
  UserCenterContact: (t: TIntl) => `${t('26588', '联系我们')}-${getSiteDefaultTitle(t)}`,
  // 企业详情-舆情
  PublicOpinionDetail: (t: TIntl) => `{公司名}-${t('406816', '企业舆情')}-${getSiteDefaultTitle(t)}`,
  // 企业详情-企业动态
  CompanyDynamicsDetail: (t: TIntl) => `{公司名}-${t('370254', '企业动态')}-${getSiteDefaultTitle(t)}`,
  // 企业详情-企业年报详情
  AnnualReportDetail: (t: TIntl) => `{公司名}{年度报告名称}-${getSiteDefaultTitle(t)}`,
  // 企业详情-APP产品详情
  AppProductDetails: (t: TIntl) => `{APP产品名称}-${getSiteDefaultTitle(t)}`,
  // 企业详情-标准信息详情
  StandardInfoDetails: (t: TIntl) => `{标准信息名称}-${getSiteDefaultTitle(t)}`,
  // 报告平台首页
  ReportHome: (t: TIntl) => `报告平台-${getSiteDefaultTitle(t)}`,
  // 尽职调查报告预览
  DDRPPreview: (t: TIntl) => `${t('421605', '尽职调查报告')}-${getSiteDefaultTitle(t)}`,
  // 深度信用报告预览
  CreditRPPreview: (t: TIntl) => `${t('421605', '尽职调查报告')}-${getSiteDefaultTitle(t)}`,
} as const

export type PageLocation = keyof typeof getPageTitleMap
